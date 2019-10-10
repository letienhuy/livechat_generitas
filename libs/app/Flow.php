<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;

class Flow extends Model
{
    protected $fillable = ['name', 'page_id', 'root_content_id', 'type'];
    protected $hidden = ['updated_at', 'created_at'];
    
    public function contents()
    {
        return $this->hasMany(FlowContent::class, 'flow_id', '_id');
    }
    public function root_content()
    {
        return $this->hasOne(FlowContent::class, 'content_id', 'root_content_id');
    }
    
    public function page()
    {
        return $this->belongsTo(Page::class, 'page_id', 'page_id');
    }
    
}
