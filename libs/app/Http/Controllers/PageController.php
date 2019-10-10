<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Page;
use App\Customer;
use App\Conversation;
use Auth;

class PageController extends Controller
{
    public function getPage($pageId)
    {
        $page = Page::wherePageId($pageId)->first();
        return response()->json([
            'page' => $page,
            'admin' => Auth::user()
        ], 200);
    }
    public function countCustomer($pageId)
    {
        $count = Conversation::wherePageId($pageId)->count();
        return response()->json([
            'count' => $count
        ]);
        
    }
    public function getCustomers(Request $request, $pageId)
    {
        $limit = 20;
        $customers = Conversation::with('customer')->wherePageId($pageId);
        if($request->message_type == 'UPDATE'){
            $now = \Carbon\Carbon::now();
            $last24Hour = $now->copy()->subHours(24);
            $customers = $customers->whereBetween('updated_at', [$last24Hour, $now]);
        }
        $customers = $customers->skip((int) $request->skip)->take($limit)->get();
        $total = Conversation::wherePageId($pageId)->count();
        return response()->json([
            'customer' => $customers,
            'limit' => $limit,
            'total' => $total
        ]);
        
    }
}
