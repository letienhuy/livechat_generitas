<?php
namespace App\Helpers;
use App\FlowContent;
class GenerateTemplate{
    public static function broadcast(FlowContent $flow)
    {
        $listMessages = [];
        try{
            foreach ($flow->data as $data) {
                $messages = [
                    "messages" => []
                ];
                $data = json_decode(json_encode($data));
                $attachment = [];
                switch($data->type){
                    case 'text':
                        if(sizeof($data->keyboard) === 0){
                            $attachment["dynamic_text"] = [
                                "text" => trim($data->content->text, '<br>')
                            ];
                        }else{
                            $attachment["attachment"] = [
                                "type" => "template",
                                "payload" => [
                                    "template_type" => "generic",
                                    "elements" => []
                                    ]
                                ];
                            $buttons = [];
                            foreach ($data->keyboard as $keyboard) {
                                $buttons[] = [
                                    'type' => 'postback',
                                    'title' => $keyboard->caption,
                                    'payload' => $keyboard->_id
                                ];
                            }
                            $attachment["attachment"]["payload"]["elements"][] = [
                                "title" => trim($data->content->text, '<br>'),
                                "buttons" => $buttons
                            ];
                        }
                    break;
                }
                $messages["messages"][] = $attachment;
                $listMessages[] = $messages;
            }
        }catch(\Exception $e){
            return $listMessages;
        }
        return $listMessages;
    }

    public static function response(FlowContent $flow, $recipientId){
        $listMessages = [];
        try{
            foreach ($flow->data as $data) {
                $messages = [
                    "messaging_type" => "RESPONSE",
                    "recipient" => [
                        "id" => $recipientId
                    ],
                    "message" => []
                ];
                $data = json_decode(json_encode($data));
                $attachment = [];
                switch($data->type){
                    case 'text':
                        if(sizeof($data->keyboard) === 0){
                            $attachment["text"] = trim($data->content->text, '<br>');
                        }else{
                            $attachment["attachment"] = [
                                "type" => "template",
                                "payload" => [
                                    "template_type" => "generic",
                                    "elements" => []
                                    ]
                                ];
                            $buttons = [];
                            foreach ($data->keyboard as $keyboard) {
                                $buttons[] = [
                                    'type' => 'postback',
                                    'title' => $keyboard->caption,
                                    'payload' => $keyboard->_id
                                ];
                            }
                            $attachment["attachment"]["payload"]["elements"][] = [
                                "title" => trim($data->content->text, '<br>'),
                                "buttons" => $buttons
                            ];
                        }
                    break;
                }
                $messages["message"] = $attachment;
                $listMessages[] = $messages;
            }
        }catch(\Exception $e){
            return $listMessages;
        }
        return $listMessages;
    }
}