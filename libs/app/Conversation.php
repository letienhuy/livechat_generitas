<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;

class Conversation extends Model
{
    protected $fillable = ['page_id', 'customer_id', 'sequences_id', 'can_reply', 'is_done', 'is_read', 'paused_bot', 'current_job_id', 'tags', 'timestamp'];

    
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'facebook_id');
    }
    
    public function messages()
    {
        return $this->hasMany(Message::class, 'conversation_id', 'id');
    }
    
}
