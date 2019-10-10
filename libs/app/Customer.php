<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = ['facebook_id', 'first_name', 'last_name', 'picture', 'gender', 'location', 'phone', 'email'];

    
    public function conversations()
    {
        return $this->hasMany(Conversation::class, 'facebook_id', 'customer_id');
    }
    
}
