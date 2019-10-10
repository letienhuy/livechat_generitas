<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;

class BroadcastCustomer extends Model
{
    protected $fillable = ['broadcast_campaign_id', 'customer_id', 'is_delivered'. 'is_opened', 'is_clicked'];
}
