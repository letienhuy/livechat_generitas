<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Jenssegers\Mongodb\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'first_name', 'last_name', 'facebook_id', 'access_token', 'api_token', 'manage_pages',
    ];
    protected $hidden = [
        'access_token', 'api_token', 'manage_pages'
    ];

    public function pages()
    {
        return $this->hasMany(Page::class, 'facebook_id', 'manage_pages');
    }
    public function roles()
    {
        return $this->hasMany(Role::class, 'facebook_id', 'facebook_id');
    }
}
