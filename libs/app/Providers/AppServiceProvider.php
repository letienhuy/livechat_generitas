<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Request;
use Auth;
use App\Page;
use App\Role;
use Schema;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        Schema::defaultStringLength(191);
        $this->app->bind('path.public', function(){
            return dirname(base_path());
        });
        view()->composer('layouts.sidebar', function ($view) {
            $subscribedPages = Page::whereIn('page_id', Auth::user()->manage_pages)->where('subscribed', true)->get();
            $currentRoute = \Request::route()->getName();
            $view->with(compact('subscribedPages', 'currentRoute'));
        });
    }
}
