<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Flow;
use App\FlowContent;

class FlowController extends Controller
{
    
    public function loadFlowContent($pageId, $flowId){
        $flow = Flow::with('contents')->with('root_content')->findOrFail($flowId);
        return response()->json([
            'flow' => $flow
        ], 200);
        
    }
    public function saveFlow(Request $request, $pageId, $flowId)
    {
        $request->validate([
            'flow' => 'required'
        ]);
        $flow = Flow::findOrFail($flowId);
        $data = json_decode(json_encode($request->flow));
        $flow->fill([
            'name' => $data->name
        ])->save();
        foreach($data->contents as $content){
            FlowContent::updateOrCreate([
                'content_id' => $content->content_id,
            ], [
                'flow_id' => $content->flow_id,
                'name' => $content->name,
                'data' => $content->data,
                'connected_buttons' => $content->connected_buttons
            ]);
        }
        return response()->json([
            'status' => 'OK'
        ], 200);
    }
    public function removeFlowContent($pageId, $contentId)
    {
        $destroy = FlowContent::whereContentId($contentId);
        if($destroy->delete()){
            return response()->json([
                'status' => 'OK'
            ], 200);
        }
        return response()->json([
            'status' => 'ERROR'
        ], 422);
    }
}
