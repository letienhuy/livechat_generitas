<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Conversation;

class StartAutomatically implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    protected $_pageId;
    protected $_conversationId;
    public function __construct($pageId, $conversationId)
    {
        $this->_pageId = $pageId;
        $this->_conversationId = $conversationId;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $conversation = Conversation::findOrFail($this->_conversationId);
        $conversation->paused_bot = [
            'status' => false,
            'paused_at' => 0
        ];
        $conversation->save();
        return true;
    }
}
