import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Conversation from './Conversation';
import MessageBox from './MessageBox';
import UserInfo from './UserInfo';

export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            admin: {},
            page: {},
            current: {},
            conversation: {
                list: [],
                skip: 0,
                total: 0,
                sorting: 'newest',
                filter: 'all'
            },
            message: {
                list: [],
                conversation: {},
                skip: 0,
                total: 0
            }
        }
        this.isPress = false;
        this.timeOutMarkRead = null;
        this.handleMessageScroll = this.handleMessageScroll.bind(this);
        this.handleChatItemClick = this.handleChatItemClick.bind(this);
        this.handleConversationScroll = this.handleConversationScroll.bind(this);
    }
    componentDidMount(){
        this.getPage(PAGE_ID);
        this.getConversations(PAGE_ID);
        Echo.private('chat.'+PAGE_ID)
        .listen('ChatInboxWasUpdated', (data) => {
            const conversation = this.state.conversation;
            let currentConversation = conversation.list.findIndex((e) => e._id === data.inbox._id);
            if(currentConversation !== -1){
                if(data.inbox._id == this.state.inboxId) data.inbox.active = true;
                conversation.list.splice(currentConversation, 1);
                conversation.list.unshift(data.inbox);
            } else {
                conversation.list.unshift(data.inbox);
                conversation.skip += 1; 
                conversation.total += 1;
            }
            this.setState({
                conversation: conversation
            });
        });
    }
    getConversations(pageId){
        const conversation = this.state.conversation;
        axios.get(baseURL + '/fb'+pageId+'/getConversations?filter='+conversation.filter+'&sorting='+conversation.sorting)
        .then((response) => {
            conversation.list = response.data.conversation;
            conversation.skip = response.data.limit,
            conversation.total = response.data.total,
            this.setState({
                conversation: conversation
            });
        })
    }
    getPage(pageId){
        axios.get(baseURL + '/fb'+pageId+'/getPage')
        .then(response => {
            this.setState({
                page: response.data.page,
                admin: response.data.admin
            });
        });
    }
    async markAsRead(pageId, conversationId){
        await axios.get(baseURL + '/fb'+pageId+'/conversation/'+conversationId+'/markAsRead');
        const conversation = this.state.conversation;
        var obj = conversation.list.find(e => e._id == conversationId);
        obj.is_read = true;
        this.setState({
            conversation: conversation
        })
    }
    async getCurrent(pageId, conversationId){
        const response = await axios.get(baseURL + '/fb'+pageId+'/conversation/'+conversationId+'/getCurrent');
        this.setState({
            current: response.data
        })
    }
    getMessages(pageId, conversationId){
        const message = this.state.message;
        axios.get(baseURL + '/fb'+pageId+'/conversation/'+conversationId+'/getMessages')
        .then((response) => {
            message.list = response.data.messages.reverse(),
            message.conversation = response.data.conversation;
            message.skip = response.data.limit;
            message.total = response.data.total;
            this.setState({
                message: message
            });
            $('.message-list .simplebar-content').scrollTop($('.message-list .simplebar-content').prop('scrollHeight'));
        });
    }
    handleChatItemClick(event, conversation){
        if(event.target.tagName.toUpperCase() == 'INPUT') return;
        if(!conversation.is_read){
            this.markAsRead(this.state.page.page_id, conversation._id);
        }
        if(this.state.current && (this.state.current._id == conversation._id)){
            this.setState({
                current: {},
                message: {
                    list: [],
                    conversation: {},
                    skip: 0,
                    total: 0
                }
            });
            Echo.leave('chat.'+this.state.page.page_id+'.'+conversation._id);
        } else {
            Echo.leave('chat.'+this.state.page.page_id+'.'+this.state.current._id);
            this.getCurrent(this.state.page.page_id, conversation._id)
            Echo.private('chat.'+this.state.page.page_id+'.'+conversation._id)
            .listen('ChatMessageWasReceived', data => {
                if(data.verify == this.state.admin._id) return false;
                clearTimeout(this.timeOutMarkRead);
                this.timeOutMarkRead = setTimeout(() =>{
                    this.markAsRead(this.state.page.page_id, data.current._id);
                }, 1000)
                const message = this.state.message;
                message.list.push(data.message);
                message.skip += 1;
                message.total += 1;
                this.setState({
                    message: message,
                    current: data.current
                });
                $('.message-list .simplebar-content').animate({scrollTop: $('.message-list .simplebar-content').prop('scrollHeight')});
            })
            .listen('ToggleAutomatically', data => {
                this.setState({
                    current: data.current
                });
            });
            this.getMessages(this.state.page.page_id, conversation._id);
        }
    }
    handleSubmitMessage(event, input, element){
        event.preventDefault();
        var text = input.value;
        var data = {
            conversation_id: this.state.selected,
            attachments: false,
            text: text,
            type: 'msgout',
            mid: false
        };
        const message = this.state.message;
        message.list.push(data);
        message.skip += 1;
        message.total += 1;
        this.setState({
            message: message
        });
        input.value = '';
        $(element).animate({scrollTop : element.scrollHeight});
        axios.post(baseURL + '/'+ACCOUNT_ID+'/conversation/'+this.state.current._id+'/sendMessage', { 'text': text , 'verify': (new Date).getTime()});
    }
    handleMessageScroll(event, element){
        if(this.state.message.conversation.is_read == false){
            this.state.message.conversation.is_read = true;
        }
        if(event.target.scrollTop === 0){
            const message = this.state.message;
            if(message.skip < message.total){
                let currentScrollTop = element.scrollHeight;
                axios.get(baseURL + '/'+ACCOUNT_ID+'/conversation/'+this.state.current._id+'/getMessages?skip='+message.skip)
                .then((response) => {
                    message.list = response.data.messages.reverse().concat(message.list);
                    message.skip += response.data.limit;
                    this.setState({
                        message: message
                    });
                    element.scrollTop = element.scrollHeight - currentScrollTop;
                });
            }
        }
    }
    handleConversationScroll(event, element){
        if(event.target.scrollTop === event.target.scrollHeight - event.target.clientHeight){
            const conversation = this.state.conversation;
            if(conversation.skip < conversation.total){
                axios.get(baseURL + '/'+ACCOUNT_ID+'/getConversations?skip='+conversation.skip)
                .then((response) => {
                    conversation.list = conversation.list.concat(response.data.conversation);
                    conversation.skip += response.data.limit;
                    this.setState({
                        conversation: conversation
                    });
                })
            }
        }
    }
    handleSortConversation(event, sort){
        const conversation = this.state.conversation;
        conversation.sorting = sort;
        axios.get(baseURL + '/'+ACCOUNT_ID+'/getConversations?filter='+conversation.filter+'&sorting='+conversation.sorting)
        .then((response) => {
            conversation.list = response.data.conversation;
            conversation.skip = response.data.limit,
            conversation.total = response.data.total,
            this.setState({
                conversation: conversation
            });
        });
    }
    handleFilterConversation(event, filter){
        const conversation = this.state.conversation;
        conversation.filter = filter;
        axios.get(baseURL + '/'+ACCOUNT_ID+'/getConversations?filter='+conversation.filter+'&sorting='+conversation.sorting)
        .then((response) => {
            conversation.list = response.data.conversation;
            conversation.skip = response.data.limit,
            conversation.total = response.data.total,
            this.setState({
                conversation: conversation
            });
        });
    }
    handleMessagePress(event){
        if(this.isPress || (this.state.current.paused_bot && this.state.current.paused_bot.status)) return;
        this.isPress = !this.isPress;
        this.toggleAuto();
    }
    toggleAuto(){
        const current = this.state.current;
        if(!current.paused_bot){
            current.paused_bot = {
                status: false,
                paused_at: 0
            }
        }
        current.paused_bot.status = !current.paused_bot.status;
        if(current.paused_bot.status){
            current.paused_bot.paused_at = Date.now();
        }else{
            current.paused_bot.paused_at = 0;
            this.isPress = false;
        }
        this.setState({
            current: current
        });
        axios.post(baseURL + '/'+ACCOUNT_ID+'/conversation/'+this.state.current._id+'/toggleAuto', {
            'status': current.paused_bot.status,
            'paused_at': current.paused_bot.paused_at
        });
    }
    render(){
        return(
            <div className="content">
                <div className="cnt-head">
                    <h1 className="cnt-head-title pull-left">Tin nhắn</h1>
                    <ul className="breadcrumb pull-right">
                        <li className="breadcrumb-item"><i className="fa fa-home"></i></li>
                        <li className="breadcrumb-item">
                            <a href="">Tin nhắn</a>
                        </li>
                    </ul>
                </div>
                <div className="cnt-main">
                    <Conversation onScroll={this.handleConversationScroll} conversation={this.state.conversation}
                        page={this.state.page} onClick={this.handleChatItemClick} current={this.state.current}
                        handleSortConversation={this.handleSortConversation.bind(this)}
                        handleFilterConversation={this.handleFilterConversation.bind(this)}
                    />
                    {this.state.current._id ? 
                        <MessageBox onScroll={this.handleMessageScroll} message={this.state.message}
                            page={this.state.page} current={this.state.current}
                            handleSubmitMessage={this.handleSubmitMessage.bind(this)} toggleAuto={this.toggleAuto.bind(this)}
                            onKeyPress={this.handleMessagePress.bind(this)}
                        />
                    : null}
                    {this.state.current._id ? <UserInfo current={this.state.current}/> : null}
                </div>
            </div>
        );
    }
}
ReactDOM.render(<Chat /> , document.getElementById('content'));