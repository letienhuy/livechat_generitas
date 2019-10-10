<?php

/*
 * This file is part of Laravel Facebook.
 *
  * (c) Vincent Klaiber <hello@vinkla.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Default Connection Name
    |--------------------------------------------------------------------------
    |
    | Here you may specify which of the connections below you wish to use as
    | your default connection for all work. Of course, you may use many
    | connections at once using the manager class.
    |
    */

    'default' => 'main',

    /*
    |--------------------------------------------------------------------------
    | Facebook Connections
    |--------------------------------------------------------------------------
    |
    | Here are each of the connections setup for your application. Example
    | configuration has been included, but you may add as many connections as
    | you would like.
    |
    */

    'connections' => [
        'test' => [
            'app_id' => '136108790405393',
            'app_secret' => 'f68dadca9d5d9ef84bcfb154375c4e2b',
            'default_graph_version' => 'v3.2',
            'default_access_token' => null,
        ],
        'main' => [
            'app_id' => '733784823655063',
            'app_secret' => 'b98bac21bd42ce32fc2f1689285d501b',
            'default_graph_version' => 'v3.2',
            //'default_access_token' => null,
        ],

    ],

];
