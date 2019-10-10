<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;

class FlowContent extends Model
{
    protected $fillable = ['content_id', 'flow_id', 'name', 'data', 'connected_buttons'];
    protected $hidden = ['updated_at', 'created_at'];

    
    public function flow()
    {
        return $this->belongsTo(Flow::class, 'flow_id', '_id');
    }
    
}
