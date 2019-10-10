<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Facebook;

class ResponsePostback implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    protected $_page;
    protected $_message;
    public function __construct($page, $message)
    {
        $this->_page = $page;
        $this->_message = $message;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try{
            Facebook::connection('test')->post('me/messages', $this->_message, $this->_page->access_token);
        }catch(\Exception $e){
            return false;
        }
    }
}
