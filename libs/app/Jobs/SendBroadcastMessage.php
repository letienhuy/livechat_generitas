<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Facebook;

class SendBroadcastMessage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    protected $_page;
    protected $_broadcast;
    protected $_messages;
    public function __construct($page, $broadcast, $messages)
    {
        $this->_page = $page;
        $this->_broadcast = $broadcast;
        $this->_messages = $messages;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        foreach($this->_messages as $message){
            try{
                Facebook::connection('test')->post('me/messages', $message, $this->_page->access_token);
            }catch(\Exception $e){
                continue;
            }
        }
        return;
    }
}
