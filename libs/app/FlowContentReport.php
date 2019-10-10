<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;

class FlowContentReport extends Model
{
    protected $fillable = ['flow_id', 'customer_id'];
}

