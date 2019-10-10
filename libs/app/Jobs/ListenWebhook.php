<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Page;
use Facebook;
use App\Message;
use App\Customer;
use App\Conversation;
use App\Helpers\BotHelper;

class ListenWebhook implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    protected $_requestBody;
    protected $_xHubSignature;
    public function __construct($requestBody, $xHubSignature)
    {
        $this->_requestBody = $requestBody;
        $this->_xHubSignature = $xHubSignature;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        if(isset($this->_requestBody->entry)){
            $entry = current($this->_requestBody->entry);
        }else{
            return false;
        }
        $pageId = $entry->id;
        $page = Page::wherePageId($pageId)->first();
        if(!$page || !$page->subscribed) return false;
        $timestamp = $entry->time;
        if(isset($entry->messaging)){
            $messaging = current($entry->messaging); //get first element of messaging
        }elseif(isset($entry->standby)){
            $messaging = current($entry->standby); //get first element of standby
        }else return false;
        if(isset($messaging->sender->id)){
            $senderId = $messaging->sender->id;
        }else{
            return false;
        }
        if(isset($messaging->recipient->id)){
            $recipientId = $messaging->recipient->id;
        }else{
            return false;
        }
        if(isset($messaging->message)){
            $mid = 'm_'.$messaging->message->mid;
            if(Message::whereMid($mid)->first()) return false;
            if(isset($messaging->message->text)){
                $text = $messaging->message->text;
            }
            if(isset($messaging->message->attachments)){
                $attachment = $messaging->message->attachments;
                $text = !isset($messaging->message->text) ? (isset($attachment->title) ? $attachment->title : null) : $text;
            }
        }elseif(isset($messaging->postback)){
            $text = $messaging->postback->title;
            $mid = null;
        }else return false;
        if($pageId == $senderId){
            $customerId = $recipientId;
            $messageType = 'msgout_bot';
            $phoneNumber = false;
            $email = false;
        }else{
            $customerId = $senderId;
            $messageType = 'msgin';
            $phoneNumber = false;
            $email = false;
            preg_match_all('/(09|03|07|08|05)+([0-9]{8})\b/', $text, $matches);
            if(is_array($matches) && sizeof($matches[0]) > 0){
                $phoneNumber = [];
                foreach($matches[0] as $p){
                    $phoneNumber[] = $p;
                }
            }
            preg_match_all('/\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}/', $text, $matches);
            if(is_array($matches) && sizeof($matches[0]) > 0){
                $email = [];
                foreach($matches[0] as $e){
                    $email[] = $e;
                }
            }
        }
        $customer = Customer::whereFacebookId($customerId)->first();
        if(!$customer){
            try{
                $from = Facebook::connection('test')->get($customerId.'/?fields=id,first_name,last_name,picture.width(200).height(200)', $page->access_token)->getDecodedBody();
            }catch(\Exception $e){
                return false;
            }
            $customer = Customer::create([
                'facebook_id' => $customerId,
                'first_name' => $from['first_name'],
                'last_name' => $from['last_name'],
                'gender' => "Null",
                'picture' => $from['picture']['data']['url'] ?? '',
                'location' => 'Vietnam',
                'timestamp' => $timestamp
            ]);
        }
        if($phoneNumber){
            $customer->phone = array_merge($customer->phone ?? [], $phoneNumber);
            $customer->save();
        }
        if($email){
            $customer->email = array_merge($customer->email ?? [], $email);
            $customer->save();
        }
        $conversation = Conversation::updateOrCreate([
            'customer_id' => $customerId,
            'page_id' => $pageId
        ], [
            'is_read' => false,
            'timestamp' => $timestamp
        ]);
        $conversation = $conversation->with('customer')->whereCustomerId($customerId)->first();
        $flowContent = null;
        if(isset($messaging->postback->payload)){
            $flowContent = \App\FlowContent::where('data.keyboard._id', 'all', [$messaging->postback->payload])->first();
        }
        if($flowContent){
            foreach($flowContent->data as $data){
                foreach($data['keyboard'] as $keyboard){
                    if($keyboard['_id'] === $messaging->postback->payload){
                        $linkedStep = \App\FlowContent::whereContentId($keyboard['flow_content_id'])->first();
                        if($linkedStep){
                            $listMessages = \App\Helpers\GenerateTemplate::response($linkedStep, $customerId);
                            foreach ($listMessages as $message) {
                                \App\Jobs\ResponsePostback::dispatch($flowContent->flow->page, $message);
                            };
                        }
                        return 0;
                    }
                }
            }
        }else{
            $message = Message::create([
                'conversation_id' => $conversation->id,
                'mid' => $mid,
                'attachments' => $attachment ?? false,
                'text' => $text,
                'type' => $messageType,
                'timestamp' => $timestamp
            ]);
            broadcast(new \App\Events\ChatInboxWasUpdated($page, $conversation));
            broadcast(new \App\Events\ChatMessageWasReceived($page, $conversation, $message));
        }
        if($messageType == 'msgin'){
            BotHelper::reply($page, $conversation, $this->_requestBody, $this->_xHubSignature);
        }
    }
}
