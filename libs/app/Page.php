<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;

class Page extends Model
{
    protected $fillable = ['name', 'page_id', 'facebook_id', 'access_token', 'picture', 'link', 'bot_id', 'subscribed_apps', 'subscribed'];
    protected $hidden = ['access_token', 'subscribed_apps'];

    
    public function bot()
    {
        return $this->belongsTo(Bot::class, 'page_id', 'page_id');
    }
    
    public function roles()
    {
        return $this->hasMany(Role::class, 'page_id', 'page_id');
    }
    public function conversations()
    {
        return $this->hasMany(Conversation::class, 'page_id', 'page_id');
    }
    public function broadcasts()
    {
        return $this->hasMany(BroadcastCampaign::class, 'page_id', 'page_id');
    }
}
