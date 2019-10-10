<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;

class FlowCustomer extends Model
{
    protected $fillable = ['flow_id', 'customer_id', 'is_delivered'. 'is_opened', 'is_clicked'];
}
