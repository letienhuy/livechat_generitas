import React, { Component } from 'react';
import {Redirect, Link} from 'react-router-dom';
import FlowEditor from '../flows/FlowEditor';
import BroadcastSetting from './BroadcastSetting';
import ContentEditable from 'react-contenteditable';
import moment from 'moment';

class BroadcastEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            broadcast: {},
            checkContentEmpty: {
                content: false,
                listDataId: [],
                listKeyboardId: []
            },
            filterCustomer: {
                customerId: [],
                facebookId: []
            },
            redirect: {
                status: false,
                redirectTo: null
            },
            setting: false,
            sending: false,
            messageType: null
        }
        this.flowDraft = {};
    }
    componentDidMount(){
        this.loadDraftBroadcast(this.props.match.params.id);
    }
    loadDraftBroadcast(broadcastId){
        axios.get(baseURL+'/'+ACCOUNT_ID+'/broadcast/loadDraftBroadcast/'+broadcastId)
        .then((response) => {
            this.setState({
                broadcast: response.data.broadcast,
                messageType: response.data.broadcast.message_type
            });
        })
        .catch((error) =>{
            this.setState({
                redirect: {
                    status: true,
                    redirectTo: "/"
                }
            });
        });
    }
    
    handleSaveFlowDraft(flow){
        this.flowDraft = flow;
    }
    handleSetting(){
        this.validate = true;
        _.each(this.flowDraft.contents, (content) => {
            var listDataId = [];
            var listKeyboardId = [];
            if(content.data.length === 0){
                this.validate = false;
                alert('Vui lòng nhập nội dung cho tin nhắn!');
                return false;
            }
            _.each(content.data, (data) =>{
                if(!data.content.text || _.isEmpty(data.content.text.replace(/<br\s*[\/]?>/gi, ""))){
                    listDataId.push(data._id);
                    this.validate = false;
                }
                _.each(data.keyboard, (keyboard) => {
                    if(!keyboard.flow_content_id){
                        listKeyboardId.push(keyboard._id);
                        this.validate = false;
                    }
                });
            });
            if(!this.validate){
                this.setState({
                    checkContentEmpty: {
                        content: content,
                        listDataId: listDataId,
                        listKeyboardId: listKeyboardId
                    }
                });
                return false;
            }
        });
        if(this.validate){
            this.setState((prevState) => (
                {setting: !prevState.setting}
            ));
        }
    }
    handleFilterCustomer(customerList){
        const filterCustomer = this.state.filterCustomer;
        _.each(customerList, (customer) =>{
            var obj = filterCustomer.facebookId.find(e => e == customer.customer_id);
            if(obj) return;
            filterCustomer.customerId.push(customer.customer._id);
            filterCustomer.facebookId.push(customer.customer.facebook_id);
        });
        this.allowUpdate = false;
        this.setState({
            filterCustomer: filterCustomer
        });
    }
    handleRemoveAllCustomer(){
        this.allowUpdate = false;
        this.setState({
            filterCustomer: {
                customerId: [],
                facebookId: []
            }
        })
    }
    handleAddCustomer(customer){
        const filterCustomer = this.state.filterCustomer;
        filterCustomer.customerId.push(customer.customer._id);
        filterCustomer.facebookId.push(customer.customer.facebook_id);
        this.allowUpdate = false;
        this.setState({
            filterCustomer: filterCustomer
        });
    }
    handleRemoveCustomer(customer){
        const filterCustomer = this.state.filterCustomer;
        _.remove(filterCustomer.customerId, (customerId) => {
            return _.isEqual(customerId, customer.customer._id);
        });
        _.remove(filterCustomer.facebookId, (facebookId) => {
            return _.isEqual(facebookId, customer.customer.facebook_id);
        });
        this.allowUpdate = false;
        this.setState({
            filterCustomer: filterCustomer
        });
    }
    handleSendBroadcast(broadcastId){
        if(this.state.broadcast.schedule === 'true' && this.state.broadcast.schedule_at < moment()) return;
        if(this.state.messageType === "UPDATE" && this.state.filterCustomer.customerId.length == 0) return false;
        $('#broadcast-status').text('Đang gửi...');
        $('#btn-broadcast-send').hide();
        $('#btn-broadcast-save').hide();
        axios.post(baseURL+'/'+ACCOUNT_ID+'/broadcast/sendBroadcast/'+broadcastId, {
            filterCustomer: this.state.filterCustomer
        })
        .then((response) => {
            this.setState({
                sending: true
            });
            $('#broadcast-status').text('Đã gửi');
        })
        .catch(() =>{
            $('#broadcast-status').text('Đã lưu');
            $('#btn-broadcast-send').show();
            $('#btn-broadcast-save').show();
        });
    }
    handleChangeMessageType(type){
        this.setState({
            messageType: type
        })
    }
    handleChangeFlowName(event){
        $(event.target).get(0).setSelectionRange(0,0);
        var flow = {
            name: event.target.value,
            contents: []
        };
        $('#broadcast-status').text('Đang lưu...');
        $('#btn-broadcast-save').prop('disabled', true);
        axios.put(baseURL+'/'+ACCOUNT_ID+'/flow/saveFlow/'+this.state.broadcast.flow._id, { flow: flow})
        .then((response) => {
            $('#broadcast-status').text('Đã lưu');
            $('#btn-broadcast-save').prop('disabled', false);
        });
    }
    onKeyDownFlowName(event){
        if(event.keyCode === 13){
            $(event.target).blur();
        }
    }
    onFocusFlowName(event){
        event.target.disabled = false;
        event.target.focus();
        event.target.selectionStart = event.target.selectionEnd = event.target.value.length;
    }
    render() {
        if(this.state.redirect.status) return <Redirect to={this.state.redirect.redirectTo}/>;
        return (
            <div className="broadcast">
                <div className="broadcast-head pd-10">
                    <div className="broadcast-head_breadcrum">
                        <span className="pull-left"><i className="icon-ic-broadcast"></i> ❯</span>
                        {this.state.broadcast.flow ? <input type="text" defaultValue={this.state.broadcast.flow.name} className="flow-name"
                            onBlur={this.handleChangeFlowName.bind(this)}
                            onFocus={this.onFocusFlowName.bind(this)}
                            onKeyDown={this.onKeyDownFlowName.bind(this)}/>
                        : null}
                    </div>
                    {this.state.setting ? 
                        <div>
                            {this.state.messageType === "MESSAGE_TAG" ?
                                <button id="btn-broadcast-send" className="btn btn-sm btn-success pull-right mg-right-10" onClick={() => this.handleSendBroadcast(this.state.broadcast._id)}><i className="fa fa-paper-plane"></i> Gửi tin nhắn</button>
                            : (this.state.filterCustomer.customerId.length === 0 ?
                                <button id="btn-broadcast-send" disabled={true} className="btn btn-sm btn-success disabled pull-right mg-right-10"><i className="fa fa-paper-plane"></i> Gửi tin nhắn</button>
                                :
                                    <button id="btn-broadcast-send" className="btn btn-sm btn-success pull-right mg-right-10" onClick={() => this.handleSendBroadcast(this.state.broadcast._id)}><i className="fa fa-paper-plane"></i> Gửi tin nhắn</button>
                                )
                            }
                            <button id="btn-broadcast-save" className="btn btn-sm pull-right mg-right-10" onClick={this.handleSetting.bind(this)}><i className="fa fa-chevron-left"></i> Trở về</button>
                        </div>
                    :   
                        <button id="btn-broadcast-save" className="btn btn-sm pull-right mg-right-10" onClick={this.handleSetting.bind(this)}><i className="fa fa-chevron-right"></i> Tiếp tục</button>
                    }
                    <div id="broadcast-status" style={{color: 'gray'}} className="btn-sm pull-right mg-right-10"> Đã lưu</div>
                </div>
                {this.state.sending ? 
                    <div className="broadcast-sending">
                        <div className="status">
                            <p><i className="fa fa-check-circle-o"></i> Đã gửi tin nhắn thành công!</p>
                            <Link to="/"><button>Về trang chủ</button></Link>
                        </div>
                    </div>
                :
                    (this.state.setting ? 
                        <BroadcastSetting
                            page={this.props.page}
                            broadcast={this.state.broadcast}
                            filterCustomer={this.state.filterCustomer}
                            handleFilterCustomer={this.handleFilterCustomer.bind(this)}
                            handleRemoveAllCustomer={this.handleRemoveAllCustomer.bind(this)}    
                            handleAddCustomer={this.handleAddCustomer.bind(this)}
                            handleRemoveCustomer={this.handleRemoveCustomer.bind(this)}
                            handleChangeMessageType={this.handleChangeMessageType.bind(this)}
                        />
                    :
                        this.state.broadcast && this.state.broadcast.flow ?
                            <FlowEditor checkContentEmpty={this.state.checkContentEmpty} page={this.props.page} flow={this.state.broadcast.flow} handleSaveFlowDraft={this.handleSaveFlowDraft.bind(this)}/>
                        :   
                            <div className="loading"></div>
                    )
                }
            </div>
        );
    }
}

export default BroadcastEditor;