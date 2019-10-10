<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Page;
use App\Customer;
use App\Message;
use DB;

class ReportController extends Controller
{
    public function index($pageId)
    {
        $page = Page::wherePageId($pageId)->first();
        return view('reports.index', compact('page'));
    }
    public function loadReports(Request $request, $pageId)
    {
        $page = Page::wherePageId($pageId)->first();
        $startDate = new \Carbon\Carbon($request->from);
        $endDate = new \Carbon\Carbon($request->to);
        $categories = [];
        $data = [
            [
                'name' => 'Người dùng mới',
				'color' => '#f4b042',
                'data' => []
            ],
            [
                'name' => 'Số tin nhắn',
                'data' => []
            ],
        ];
        $title = "Thống kê tổng quan từ {$request->from} đến ngày {$request->to}";
        while ($startDate <= $endDate) {
            $categories[] = $startDate->format('d-m-Y');
            $data[0]['data'][] = Customer::whereBetween('created_at', [
                $startDate,
                $startDate->copy()->addDays(1)
            ])->count();
            $data[1]['data'][] = Message::whereBetween('created_at', [
                $startDate,
                $startDate->copy()->addDays(1)
            ])->count();
            $startDate->addDays(1);
        }
        return response()->json([
            'title' => $title,
            'categories' => $categories,
            'data' => $data
        ], 200);
        
    }
    public function loadReportUsers(Request $request, $pageId)
    {
        $page = Page::wherePageId($pageId)->first();
        $startDate = new \Carbon\Carbon($request->from);
        $endDate = new \Carbon\Carbon($request->to);
        $categories = [];
        $data = [
            [
                'name' => "Người dùng chỉ có email",
                'data' => []
            ],
            [
                'name' => "Người dùng chỉ có SĐT",
				'color' => '#00ffff',
                'data' => []
            ],
            [
                'name' => "Người dùng có cả SĐT và Email",
				'color' => '#3dff7a',
                'data' => []
            ],
            [
                'name' => "Người dùng không có thông tin",
				'color' => '#f4b042',
                'data' => []
            ]
        ];
        $title = "Thống kê người dùng từ {$request->from} đến ngày {$request->to}";
        while ($startDate <= $endDate) {
            $categories[] = $startDate->format('d-m-Y');
            $data[0]['data'][] = Customer::where([['email', '<>', null], ['phone', null]])->whereBetween('created_at', [
                $startDate,
                $startDate->copy()->addDays(1)
            ])->count();
            $data[1]['data'][] = Customer::where([['phone', '<>', null], ['email', null]])->whereBetween('created_at', [
                $startDate,
                $startDate->copy()->addDays(1)
            ])->count();
            $data[2]['data'][] = Customer::where([['phone', '<>', null], ['email', '<>', null]])->whereBetween('created_at', [
                $startDate,
                $startDate->copy()->addDays(1)
            ])->count();
            $data[3]['data'][] = Customer::where([['phone', null], ['email', null]])->whereBetween('created_at', [
                $startDate,
                $startDate->copy()->addDays(1)
            ])->count();
            $startDate->addDays(1);
        }
        return response()->json([
            'title' => $title,
            'categories' => $categories,
            'data' => $data
        ], 200);
        
    }
    public function loadReportMessages(Request $request, $pageId)
    {
        $page = Page::wherePageId($pageId)->first();
        $startDate = new \Carbon\Carbon($request->from);
        $endDate = new \Carbon\Carbon($request->to);
        $categories = [];
        $data = [
            [
                'name' => "Người trả lời",
                'data' => []
            ],
            [
                'name' => "BOT trả lời",
                'data' => []
            ],
        ];
        $title = "Thống kê số tin nhắn từ {$request->from} đến ngày {$request->to}";
        while ($startDate <= $endDate) {
            $categories[] = $startDate->format('d-m-Y');
            $data[0]['data'][] = Message::where('type', 'msgout_bot')->whereBetween('created_at', [
                $startDate,
                $startDate->copy()->addDays(1)
            ])->count();
            $data[1]['data'][] = Message::where('type', 'msgout')->whereBetween('created_at', [
                $startDate,
                $startDate->copy()->addDays(1)
            ])->count();
            $startDate->addDays(1);
        }
        return response()->json([
            'title' => $title,
            'categories' => $categories,
            'data' => $data
        ], 200);
        
    }
}
