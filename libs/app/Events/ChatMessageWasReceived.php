<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class ChatMessageWasReceived implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    protected $_page;
    protected $_conversation;
    protected $_message;
    protected $_verify;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($page, $conversation, $message, $verify = null)
    {
        $this->_page = $page;
        $this->_conversation = $conversation;
        $this->_message = $message;
        $this->_verify = $verify;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel("chat.{$this->_page->page_id}.{$this->_conversation->id}");
    }
    public function broadcastWith()
    {
        return [
            'message' => $this->_message,
            'current' => $this->_conversation,
            'verify' => $this->_verify
        ];
    }
}
