<?php
use App\Page;
use App\Role;
use App\Conversation;
/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('user.page', function ($user) {
    return true;
});
Broadcast::channel('chat.{pageId}.{conversationId}', function ($user, $pageId, $conversationId) {
    $page = Page::wherePageId($pageId)->first();
    $conversation = $page->conversations()->find($conversationId);
    $role = $user->roles()->wherePageId($pageId)->first();
    if($page && $conversation && $role && $role->role > 3) return true;
    return false;
});
Broadcast::channel('chat.{pageId}', function ($user, $pageId) {
    $page = Page::wherePageId($pageId)->first();
    $role = $user->roles()->wherePageId($pageId)->first();
    if($page && $role && $role->role >= 3) return true;
    return false;
});