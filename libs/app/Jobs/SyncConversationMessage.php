<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Facebook;
use Redis;
use App\Message;

class SyncConversationMessage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    protected $_fbConversationId;
    protected $_page;
    protected $_conversation;
    protected $_after;
    public function __construct($fbConversationId, $page, $conversation, $after = null)
    {
        $this->_fbConversationId = $fbConversationId;
        $this->_page = $page;
        $this->_conversation = $conversation;
        $this->_after = $after;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {   
        try{
            $messages = Facebook::connection('test')->get($this->_fbConversationId.'/messages?fields=id,message,from,to,attachments,shares,created_time&limit=100'.($this->_after ? '&after='.$this->_after : ''), $this->_page->access_token)->getDecodedBody();
        }catch(\Exception $e){
            exit;
        }
        $messages = json_decode(json_encode($messages));
        //if(isset($messages->paging->next)){
            //SyncConversationMessage::dispatch($this->_fbConversationId, $this->_page, $this->_conversation, $messages->paging->cursors->after);
        //}
        foreach($messages->data as $data){
            if(isset($data->attachments)){
				if(isset($data->attachments->data)){	
					$attachments = [];
					foreach($data->attachments->data as $attachment){
						if(strpos($attachment->mime_type, 'image') !== FALSE){
							$attachments[] = [
								"type" => "image",
								"payload" => [
									"url" => $attachment->image_data->url
								]
							];
						}else{
							$attachments[] = [
								"type" => "file",
								"payload" => [
									"url" => $attachment->file_url
								]
							];
						}
					}
				}else{
					$attachments = false;
				}
            }else{
                $attachments = false;
            }
            if(empty($data->message) && !$attachments) continue;
            $message = Message::create([
                'fbConversationId' => $this->_conversation->id,
                'mid' => $data->id,
                'attachments' => $attachments,
                'text' => $data->message,
                'type' => $data->from->id !== $this->_page->page_id ? 'msgin' : 'msgout',
                'timestamp' => round(strtotime($data->created_time) * 1000)
            ]);
        }
    }
}
