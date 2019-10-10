<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;

class Role extends Model
{
    protected $fillable = ['facebook_id', 'page_id', 'role', 'role_action'];
    
    public function user()
    {
        return $this->belongsTo(User::class, 'facebook_id', 'facebook_id');
    }
    public function page()
    {
        return $this->belongsTo(Page::class, 'page_id', 'page_id');
    }
}
