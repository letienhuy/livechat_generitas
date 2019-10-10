<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Facebook;
use App\Conversation;
use App\Customer;
use App\Page;

class SyncConversation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    protected $_after;
    protected $_page;
    public function __construct($page, $after = null)
    {
        $this->_after = $after;
        $this->_page = $page;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try{
            $conversations = Facebook::connection('test')->get('me/conversations?fields=id,senders,can_reply,updated_time,message_count&limit=10'.($this->_after ? '&after='.$this->_after : ''), $this->_page->access_token)->getDecodedBody();
        }catch(\Exception $e){
            exit;
        }
        $conversations = json_decode(json_encode($conversations));
        //if(isset($conversations->paging->next)){
            //SyncConversation::dispatch($this->_page, $conversations->paging->cursors->after);
        //}
        foreach($conversations->data as $data){
            $senderId = current($data->senders->data)->id;
            try{
                $sender = Facebook::connection('test')->get($senderId.'/?fields=id,first_name,last_name,name,picture.width(200).height(200)', $this->_page->access_token)->getDecodedBody();
            }catch(\Exception $e){
                continue;
            }
            $sender = json_decode(json_encode($sender));
            $conversation = Conversation::updateOrCreate([
                'customer_id' => $senderId,
                'page_id' => $this->_page->page_id
            ], [
                'can_reply' => $data->can_reply ?? false,
                'timestamp' => round(strtotime($data->updated_time) * 1000)
            ]);
            Customer::updateOrCreate([
                'facebook_id' => $senderId,
            ], [
                'first_name' => $sender->first_name,
                'last_name' => $sender->last_name,
                'gender' => $sender->gender ?? 'Null',
                'location' => $sender->location->name ?? 'Vietnam',
                'picture' => $sender->picture->data->url,
                'timestamp' => round(strtotime($data->updated_time) * 1000)
            ]);
            SyncConversationMessage::dispatch($data->id, $this->_page, $conversation);
        }
    }
}
