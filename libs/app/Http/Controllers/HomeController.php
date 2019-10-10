<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Facebook;
use Auth;
use App\Page;
use App\Role;

class HomeController extends Controller
{
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('index');
    }
    public function account(){
        $subscribed = Page::whereIn('page_id', Auth::user()->manage_pages)->where('subscribed', true)->first();
        if($subscribed){
            return redirect()->route('account.chat.home', ['pageId' => $subscribed->page_id]);
        }
        return redirect()->route('account.add');
    }
    public function addFacebookPage()
    {
        $pages = Page::whereIn('page_id', Auth::user()->manage_pages)->get();
        return view('account', compact('pages'));
    }
}
