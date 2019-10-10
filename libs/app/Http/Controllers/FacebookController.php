<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\Bot;
use Facebook;
use Auth;
use App\User;
use App\Page;
use App\Message;
use App\Role;

class FacebookController extends Controller
{
    public function login()
    {
        $permissions = [
            'manage_pages',
            'pages_messaging',
            'read_page_mailboxes'
        ];
        ob_start();
        session_start();
        $loginUrl = Facebook::connection('test')->getRedirectLoginHelper()->getReRequestUrl(route('callback'), $permissions);
        return redirect($loginUrl);
    }
    public function callback(Request $request)
    {
        session_start();
        $fb = Facebook::connection('test');
        $helper = $fb->getRedirectLoginHelper();
        try{
            $accessToken = $helper->getAccessToken();
        } catch(\Exception $e) {
            return redirect()->route('home');
            exit;
        }
        $oAuth2Client = $fb->getOAuth2Client();
        $tokenMetadata = $oAuth2Client->debugToken($accessToken);
        $tokenMetadata->validateAppId($fb->getApp()->getId());
        $tokenMetadata->validateExpiration();

        if (! $accessToken->isLongLived()) {
            try {
                $accessToken = $oAuth2Client->getLongLivedAccessToken($accessToken);
            } catch (\Exception $e) {
                return redirect()->route('home');
                exit;
            }
        }
        try{
            $fbUser = (object) Facebook::connection('test')->get('me?fields=id,first_name,last_name', $accessToken)->getDecodedBody();
            $listPages = Facebook::connection('test')->get('me/accounts?fields=id,name,tasks,access_token,picture.height(100),link', $accessToken)->getDecodedBody();
        }catch(\Exception $e){
            return redirect()->route('home');
            exit;
        }
        $managePages = [];
        foreach ($listPages['data'] as $page) {
            $page = json_decode(json_encode($page));
            $managePages[] = $page->id;
            if(Page::wherePageId($page->id)->first()){
                Page::updateOrCreate([
                    'page_id' => $page->id
                ],[
                    'name' => $page->name,
                    'picture' => $page->picture->data->url ?? '',
                    'access_token' => $page->access_token,
                    'link' => $page->link,
                ]);
                if(Role::whereFacebookId($fbUser->id)->wherePageId($page->id)->first())
                    continue;
                Role::create([
                    'facebook_id' => $fbUser->id,
                    'page_id' => $page->id,
                    'role' => count($page->tasks),
                    'role_action' => $page->tasks
                ]);
            }else{
                Role::create([
                    'facebook_id' => $fbUser->id,
                    'page_id' => $page->id,
                    'role' => count($page->tasks),
                    'role_action' => $page->tasks
                ]);
                Page::updateOrCreate([
                    'page_id' => $page->id
                ],[
                    'name' => $page->name,
                    'picture' => $page->picture->data->url ?? '',
                    'access_token' => $page->access_token,
                    'link' => $page->link,
                ]);
            }
        }
        $user = User::updateOrCreate([
            'facebook_id' => $fbUser->id
        ], [
            'first_name' => $fbUser->first_name,
            'last_name' => $fbUser->last_name,
            'manage_pages' => $managePages,
            'access_token' => $accessToken->getValue()
        ]);
        Role::whereFacebookId($user->facebook_id)->whereNotIn('page_id', $managePages)->delete();
        if(Auth::login($user))
            return redirect()->route('account.home');
        return redirect()->route('home');
        
    }
    public function connect($pageId)
    {
        $page = Page::where('page_id', $pageId)->first();
        if(!$page->subscribed){
            $subscribedFields = [
                "messages",
                "message_deliveries",
                "messaging_postbacks",
                "message_reads",
				"messaging_optins",
				"message_echoes"
            ];
            try{
                $pageSubscribedInfo = Facebook::connection('test')->get('me/subscribed_apps', $page->access_token)->getDecodedBody();
                $pageSubscribedStatus = Facebook::connection('test')->post('me/subscribed_apps', ['subscribed_fields' => $subscribedFields], $page->access_token)->getDecodedBody();
            }catch(\Exception $e){
                return redirect()->back()->withErrors('Trang đang bị giới hạn, hãy thử kết nối lại sau 24h, xin lỗi vì sự bất tiện này!');
            }
            $page->fill([
                'subscribed' => $pageSubscribedStatus['success'],
                'subscribed_apps' => json_encode(current($pageSubscribedInfo['data'])),
            ])->save();
            //\App\Jobs\SyncConversation::dispatch($page);
        }
        return redirect()->route('account.chat.home', ['pageId' => $pageId]);
    }

    public function getWebhook(Request $request)
    {
        if ($request->hub_verify_token && $request->hub_verify_token == 'test') {
            return $request->hub_challenge ?? '';
        }
        abort(403);
    }
    public function postWebhook(Request $request)
    {
        $requestBody = json_decode($request->getContent());
        \App\Jobs\ListenWebhook::dispatch($requestBody, $request->header('X-Hub-Signature'));
        return response()->json(['code' => 200, 'status' => 'OK']);
    }
}
