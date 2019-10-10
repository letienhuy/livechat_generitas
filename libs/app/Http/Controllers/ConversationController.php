<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Contracts\Bus\Dispatcher;
use App\Conversation;
use App\Message;
use App\Page;
use Auth;
use Facebook;

class ConversationController extends Controller
{
    public function index($pageId)
    {
        $page = Page::where('page_id', $pageId)->first();
        if($page){
            if(!$page->subscribed){
                return redirect()->route('account.connect', ['pageId' => $pageId]);
            }
            return view('chats.index', compact('page'));
        }
        return redirect()->route('account.home');
    }

    /**
     *  send message from user
     *
     * @param Request $request
     * @param string $pageId ID fanpage
     * @param string $inboxId ID inbox
     * @return void
     */
    public function sendMessage(Request $request, $pageId, $conversationId)
    {
        $request->validate([
            'text' => 'required'
        ]);
        $page = Page::where('page_id', $pageId)->first();
        $conversation = Conversation::where('page_id', $pageId)->findOrFail($conversationId);
        $conversation->timestamp = round(microtime(true) * 1000);
        $conversation->save();
        try{
            $sendingMessage = Facebook::connection('test')->post('/me/messages', [
                'messaging_type' => "RESPONSE",
                'recipient' => [
                    'id' => $conversation->customer_id
                ],
                'message' => [
                    'text'=> $request->text
                ]
            ], $page->access_token);
        }catch(\Exception $e){
            return response()->json(['status' => false]);
        }
        $message = Message::create([
            'conversation_id' => $conversation->id,
            'text' => $request->text,
            'timestamp' => round(microtime(true) * 1000),
            'attachments' => false,
            'type' => 'msgout',
            'mid' => $sendingMessage->getDecodedBody()['message_id']
        ]);
        $conversation = \App\Conversation::with('customer')->findOrFail($conversation->id);
        broadcast(new \App\Events\ChatInboxWasUpdated($page, $conversation));
        broadcast(new \App\Events\ChatMessageWasReceived($page, $conversation, $message, \Auth::id()));
        return response()->json(['status' => true]);
    }

    /**
     *  get list inboxes
     *
     * @param Request $request
     * @param string $pageId ID fanpage
     * @return json
     */
    public function getConversations(Request $request, $pageId)
    {
        $limit = 20;
        $conversation = Conversation::with('customer')->wherePageId($pageId);
        switch ($request->filter) {
            case 'unread':
                $conversation = $conversation->where('is_read', false);
                break;
            case 'is_done':
                $conversation = $conversation->where('is_done', true);
                break;
            case 'all':
            default:
                break;
        }
        $conversation = $conversation->orderBy('timestamp', $request->sorting ?? 'desc')->skip((int) $request->skip)->take($limit)->get();
        $total = Conversation::count();
        return response()->json([
            'conversation' => $conversation,
            'limit' => $limit,
            'total' => $total
        ], 200);
    }
    public function getCurrent($pageId, $conversationId)
    {
        $current = Conversation::with('customer')->find($conversationId);
        return response()->json($current);
    }
    public function markAsRead($pageId, $conversationId)
    {
        $current = Conversation::find($conversationId);
        $current->is_read = true;
        $current->save();
        return response()->json([
            'status' => 'OK'
        ]);
    }

    /**
     *  get message for inbox
     *
     * @param Request $request
     * @param string $pageId ID of fanpage
     * @param string $inboxId ID of inbox
     * @return json
     */
    public function getMessages(Request $request, $pageId, $conversationId)
    {
        $conversation = Conversation::with('customer')->wherePageId($pageId)->findOrFail($conversationId);
        if(!$conversation->is_read){
            $conversation->is_read = true;
            $conversation->save();
        }
        $total = $conversation->messages()->count();
        $limit = 20;
        $messages = $conversation->messages()->orderBy('timestamp', 'desc')->skip((int) $request->skip)->take($limit)->get();
        return response()->json([
            'messages' => $messages,
            'conversation' => $conversation,
            'limit' => $limit,
            'total' => $total
        ], 200);
    }

    /**
     *  play or pause auto chat bot
     *
     * @param string $pageId ID of fanpage
     * @param string $inboxId ID of inbox
     * @return json
     */
    public function toggleAuto(Request $request, $pageId, $conversationId)
    {
        $conversation = Conversation::with('customer')->wherePageId($pageId)->findOrFail($conversationId);
        $pausedBot = [
            'status' => $request->status,
            'paused_at' => $request->paused_at
        ];
        $conversation->paused_bot = $pausedBot;
        $conversation->save();
        if($request->status){
            $job = (new \App\Jobs\StartAutomatically($pageId, $conversationId))->delay(now()->addMinutes(30));
            $jobId = app(Dispatcher::class)->dispatch($job);
            $conversation->current_job_id = $jobId;
            $conversation->save();
        }else{
            $job = \Queue::getRedis()->zscan('queues:default:delayed', 0, 'MATCH', "*{$conversation->current_job_id}*");
            if(isset($job[1])){
                if(isset(array_keys($job[1])[0])){
                    \Queue::getRedis()->zrem('queues:default:delayed', array_keys($job[1])[0]);
                    $conversation->current_job_id = null;
                    $conversation->save();
                }
            }
        }
        broadcast(new \App\Events\ToggleAutomatically($pageId, $conversation));
        return response()->json(['status' => 'OK'], 200);
    }
}
