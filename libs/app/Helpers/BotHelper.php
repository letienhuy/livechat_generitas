<?php
namespace App\Helpers;

use App\Message;
use Facebook;

class BotHelper{
    /**
     * Undocumented function
     *
     * @param [type] $conversation
     * @param [type] $requestBody
     * @param [type] $xHubSignature
     * @return void
     */
    public static function reply($page, $conversation, $requestBody, $xHubSignature)
    {
        if($page->bot){
            if($conversation->paused_bot['status'] !== true){
                try {
                    Facebook::connection('test')->post('/me/messages', [
                        'recipient' => [
                            'id' => $conversation->customer_id
                        ],
                        "sender_action" => "typing_on"
                    ], $page->access_token);
                } catch (\Exception $e) {
                	exit();
                }
                try{
                    $client = new \GuzzleHttp\Client();
                    $res = $client->request('POST', $page->bot->api_url, [
                        'headers' => ['X-Hub-Signature' => $xHubSignature],
                        'json' => $requestBody
                    ]);
                    if($res->getStatusCode() == 200){
                        try {
                            Facebook::connection('test')->post('/me/messages', [
                                'recipient' => [
                                    'id' => $conversation->customer_id
                                ],
                                "sender_action" => "typing_off"
                            ], $page->access_token);
                        } catch (\Exception $e) {
                            exit();
                        }
                    }
                } catch(Exception $e){
                    exit();
                }
            }
        }
    }
}
