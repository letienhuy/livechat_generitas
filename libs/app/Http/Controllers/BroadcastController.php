<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Facebook;
use DB;
use App\BroadcastCampaign;
use App\BroadcastCustomer;
use App\Flow;
use App\FlowContent;
use App\Page;
use App\Helpers\GenerateTemplate;

class BroadcastController extends Controller
{
    public function index($pageId)
    {
        $page = Page::wherePageId($pageId)->first();
        return view('broadcasts.index', compact('page'));
    }
    public function getBroadcast($pageId)
    {
        $page = Page::wherePageId($pageId)->first();
        $limit = 20;
        $broadcast = $page->broadcasts()->with('flow')->orderBy('created_at', 'desc')->paginate($limit);
        return response()->json([
            'broadcast' => $broadcast,
        ], 200);

    }
    public function createBroadcast($pageId)
    {
        $page = Page::wherePageId($pageId)->first();
        $broadcast = BroadcastCampaign::create([
            'page_id' => $page->page_id,
            'status' => 'draft',
            'schedule' => false,
            'schedule_at' => null,
            'notification' => 'REGULAR',
            'message_type' => 'MESSAGE_TAG',
            'message_tag' => 'NON_PROMOTIONAL_SUBSCRIPTION',
        ]);
        $flow = Flow::create([
            'name' => 'Nội dung',
            'page_id' => $page->page_id,
            'type' => 'draft',
        ]);
        $broadcast->flow_id = $flow->id;
        $broadcast->save();
        $content = FlowContent::create([
            'content_id' => uniqid(),
            'flow_id' => $flow->id,
            'name' => 'Tin nhắn',
            'data' => [
                [
                    '_id' => uniqid(),
                    'type' => 'text',
                    'content' => [
                        'text' => null,
                    ],
                    'keyboard' => [],
                ],
            ],
            'connected_buttons' => []
        ]);
        $flow->root_content_id = $content->content_id;
        $flow->save();
        return response()->json([
            'status' => 'OK',
            'broadcast_id' => $broadcast->id,
            'flow_id' => $flow->id,
        ], 200);
    }
    public function loadDraftBroadcast($pageId, $broadcastId)
    {
        $broadcast = BroadcastCampaign::with('flow')->where('status', 'draft')->findOrFail($broadcastId);
        return response()->json([
            'broadcast' => $broadcast,
        ], 200);

    }
    public function loadHistoryBroadcast($pageId, $broadcastId)
    {
        $broadcast = BroadcastCampaign::with('flow')->where('status', 'published')->findOrFail($broadcastId);
        return response()->json([
            'broadcast' => $broadcast,
        ], 200);

    }
    public function saveBroadcast(Request $request, $pageId, $broadcastId)
    {
        $broadcast = BroadcastCampaign::find($broadcastId);
        $broadcast->fill($request->broadcast);
        $broadcast->save();
        return response()->json([
            'status' => 'OK',
        ]);

    }
    public function sendBroadcast(Request $request, $pageId, $broadcastId)
    {
        $page = Page::wherePageId($pageId)->firstOrFail();
        $broadcast = BroadcastCampaign::findOrFail($broadcastId);
        $flow = Flow::with('root_content')->findOrFail($broadcast->flow_id);
        if($broadcast->message_type === 'UPDATE'){
            $filterCustomer = json_decode(json_encode($request->filterCustomer));
            foreach($filterCustomer->customerId as $key => $customerId){
                $broadcastCustomer = BroadcastCustomer::create([
                    'broadcast_campaign_id' => $broadcast->id,
                    'customer_id' => $customerId,
                    'is_delivered' => 0,
                    'is_opened' => 0,
                    'is_clicked'=> 0
                ]);
                $message = GenerateTemplate::response($flow->root_content, $filterCustomer->facebookId[$key]);
                if($broadcastCustomer){
                    if($broadcast->schedule == 'true'){
                        $schedule_at = (new \Carbon\Carbon($broadcast->schedule_at))->timestamp;
                        \App\Jobs\SendBroadcastMessage::dispatch($page, $broadcast, $message)->delay($schedule_at-time());
                    } else
                        \App\Jobs\SendBroadcastMessage::dispatch($page, $broadcast, $message);
                }
            }
        }else{
            $listMessages = GenerateTemplate::broadcast($flow->root_content);
            $schedule_at = (new \Carbon\Carbon($broadcast->schedule_at))->timestamp;
            foreach($listMessages as $message){
                try{
                    $messageCreative = Facebook::connection('test')->post('me/message_creatives', $message, $page->access_token)->getDecodedBody();
                }catch(\Exception $e){
                    return response()->json([
                        'status' => $e->getMessage()
                    ], 422);
                }
                \App\Jobs\SendBroadcastCreative::dispatch($page, $broadcast, $messageCreative["message_creative_id"], $schedule_at);
                $schedule_at++;
            }
        }
        $broadcast["status"] = "published";
        $broadcast->save();
        return response()->json([
            'status' => 'OK'
        ]);
    }
    public function cloneBroadcast($pageId, $broadcastId)
    {
        $broadcast = BroadcastCampaign::findOrFail($broadcastId);
        $flow = Flow::with('contents')->findOrFail($broadcast->flow_id);
        $broadcastClone = BroadcastCampaign::create([
            'page_id' => $flow->page_id,
            'status' => 'draft',
            'schedule' => false,
            'schedule_at' => null,
            'notification' => 'REGULAR',
            'message_type' => 'MESSAGE_TAG',
            'message_tag' => 'NON_PROMOTIONAL_SUBSCRIPTION',
        ]);
        $flowClone = Flow::create([
            'name' => $flow->name.' - copy',
            'page_id' => $flow->page_id,
            'type' => $flow->type,
        ]);
        $listNewContentId = [];
        $listNewKeyboardId = [];
        foreach($flow->contents as $content){
            $contentCloneId = uniqid();
            $listNewContentId[$content->content_id] = $contentCloneId;
            foreach ($content->data as $data) {
                foreach ($data['keyboard'] as $keyboard) {
                    $newKeyboardId = uniqid('ACT:');
                    $listNewKeyboardId[$keyboard['_id']] = $newKeyboardId;
                }
            }
        }
        foreach($flow->contents as $content){
            $contentData = (array) $content->data;
            $connectedButtons = (array) $content->connected_buttons;
            foreach ($contentData as &$data) {
                foreach ($data['keyboard'] as &$keyboard) {
                    $keyboard['_id'] = $listNewKeyboardId[$keyboard['_id']];
                    $keyboard['flow_content_id'] = $listNewContentId[$keyboard['flow_content_id']] ?? null;
                }
            }
            foreach ($connectedButtons as $key => $value) {
                $connectedButtons[$key] = $listNewKeyboardId[$value];
            }
            $contentClone = FlowContent::create([
                'content_id' => $listNewContentId[$content->content_id],
                'name' => $content->name,
                'flow_id' => $flowClone->id,
                'data' => $contentData,
                'connected_buttons' => $connectedButtons
            ]);
        }
        $flowClone->root_content_id = array_shift($listNewContentId);
        $flowClone->save();
        $broadcastClone->flow_id = $flowClone->id;
        $broadcastClone->save();
        $broadcastClone = BroadcastCampaign::with('flow')->findOrFail($broadcastClone->id);
        return response()->json([
            'broadcast' => $broadcastClone
        ]);
    }
    public function removeBroadcast($pageId, $broadcastId)
    {
        $broadcast = BroadcastCampaign::findOrFail($broadcastId);
        $flow = Flow::findOrFail($broadcast->flow_id);
        $flow->contents()->delete();
        $flow->delete();
        $broadcast->delete();
        
        return response()->json([
            'status' => 'OK'
        ]);
    }
}
