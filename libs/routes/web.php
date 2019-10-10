<?php
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::group(['middleware' => ['guest']], function () {
    Route::get('/', 'HomeController@index')->name('home');
    Route::get('login', 'FacebookController@login')->name('login');
    Route::get('callback', 'FacebookController@callback')->name('callback');
    Route::get('privacy', function () {
        return view('privacy');
    });
    Route::get('tos', function () {
        return view('tos');
    });
});
Route::get('logout', function () {
    $logoutUrl = Facebook::connection('test')->getRedirectLoginHelper()->getLogoutUrl(Auth::user()->access_token, route('home'));
    Auth::logout();
    return redirect($logoutUrl);
})->middleware('auth')->name('logout');
Route::get('webhook', 'FacebookController@getWebhook');
Route::post('webhook', 'FacebookController@postWebhook');

Route::group(['middleware' => ['auth'], 'as' => 'account.'], function () {

    Route::group(['prefix' => 'account'], function() {
        Route::get('/', 'HomeController@account')->name('home');
        Route::get('addNewPage', 'HomeController@addFacebookPage')->name('add');
    });
    Route::group(['prefix' => 'fb{pageId}'], function($pageId) {
        Route::get('connect', 'FacebookController@connect')->name('connect');
        Route::get('livechat', 'ConversationController@index')->name('chat.home');
        Route::get('getPage', 'PageController@getPage');
        Route::get('getCustomers', 'PageController@getCustomers');
        Route::get('countCustomer', 'PageController@countCustomer');
        Route::get('getConversations', 'ConversationController@getConversations');

        Route::group(['prefix' => 'conversation'], function() {
            Route::get('{conversationId}/getMessages', 'ConversationController@getMessages');
            Route::get('{conversationId}/markAsRead', 'ConversationController@markAsRead');
            Route::get('{conversationId}/getCurrent', 'ConversationController@getCurrent');
            Route::post('{conversationId}/sendMessage', 'ConversationController@sendMessage');
            Route::post('{conversationId}/toggleAuto', 'ConversationController@toggleAuto');
        });

        Route::group(['prefix' => 'report', 'as' => 'report.'], function() {
            Route::get('/', 'ReportController@index')->name('home');
            Route::get('loadReports', 'ReportController@loadReports');
            Route::get('loadReportUsers', 'ReportController@loadReportUsers');
            Route::get('loadReportMessages', 'ReportController@loadReportMessages');
        });

        Route::group(['prefix' => 'broadcast', 'as' => 'broadcast.'], function() {
            Route::get('getBroadcast', 'BroadcastController@getBroadcast');
            Route::post('createBroadcast', 'BroadcastController@createBroadcast');
            Route::post('cloneBroadcast/{broadcastId}', 'BroadcastController@cloneBroadcast');
            Route::put('saveBroadcast/{broadcastId}', 'BroadcastController@saveBroadcast');
            Route::delete('removeBroadcast/{broadcastId}', 'BroadcastController@removeBroadcast');
            Route::post('sendBroadcast/{broadcastId}', 'BroadcastController@sendBroadcast');
            Route::get('loadDraftBroadcast/{broadcastId}', 'BroadcastController@loadDraftBroadcast');
            Route::get('loadHistoryBroadcast/{broadcastId}', 'BroadcastController@loadHistoryBroadcast');
            Route::get('/{path?}', 'BroadcastController@index')->where('path', '.*')->name('home');
        });

        Route::group(['prefix' => 'flow', 'as' => 'flow.'], function() {
            Route::get('loadFlowContent/{flowId}', 'FlowController@loadFlowContent');
            Route::put('saveFlow/{flowId}', 'FlowController@saveFlow');
            Route::delete('removeFlowContent/{contentId}', 'FlowController@removeFlowContent');
        });
    });
});



