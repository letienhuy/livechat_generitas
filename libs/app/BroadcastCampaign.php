<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;

class BroadcastCampaign extends Model
{
    protected $fillable = ['name', 'page_id', 'flow_id', 'status', 'schedule', 'schedule_at', 'broadcast_id', 'notification', 'message_type', 'message_tag'];
    
    public function flow()
    {
        return $this->belongsTo(Flow::class, 'flow_id', '_id');
    }
    
}
