<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;

class Bot extends Model
{
    protected $fillable = ['page_id', 'api_url'];
    
    public function page()
    {
        return $this->belongsTo(Page::class, 'page_id', 'page_id');
    }
    
}
