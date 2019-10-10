<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Facebook;

class SendBroadcastCreative implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    protected $_page;
    protected $_broadcast;
    protected $_messageCreativeId;
    protected $_scheduleAt;
    public function __construct($page, $broadcast, $messageCreativeId, $scheduleAt)
    {
        $this->_page = $page;
        $this->_broadcast = $broadcast;
        $this->_messageCreativeId = $messageCreativeId;
        $this->_scheduleAt = $scheduleAt;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        if($this->_broadcast->schedule == 'true'){
            $bodyBroadcast = [
                "message_creative_id" => $this->_messageCreativeId,
                'schedule_time' => $this->_scheduleAt
            ];
        }else{
            $bodyBroadcast = [
                "message_creative_id" => $this->_messageCreativeId,
                "notification_type" => $this->_broadcast->notification,
                "messaging_type" => "MESSAGE_TAG",
                "tag" => "NON_PROMOTIONAL_SUBSCRIPTION"
            ];
        }
        try{
            $broadcast = Facebook::connection('test')->post('me/broadcast_messages', $bodyBroadcast, $this->_page->access_token)->getDecodedBody();
        }catch(\Exception $e){
            return;
        }
    }
}
