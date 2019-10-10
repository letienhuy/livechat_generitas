import React, { Component } from 'react';
import FilterUser from './FilterUser';
import ScrollBar from 'simplebar-react';
import SearchUser from './SearchUser';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

class BroadcastSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            broadcast: props.broadcast,
            schedule_at: moment(),
            countCustomer: 0,
            isFilter: false,
            isSearch: false,
        }
        this.allowUpdate = true;
        this.broadcastStatus = document.getElementById('broadcast-status');
        this.handleScheduleTime = this.handleScheduleTime.bind(this);
    }
    componentDidMount(){
        this.btnSend = document.getElementById('btn-broadcast-send');
        this.countCustomer();
        if(this.state.broadcast.schedule_at){
            this.allowUpdate = false;
            this.setState({
                schedule_at: moment(this.state.broadcast.schedule_at)
            })
        }
    }
    componentDidUpdate(){
        if(!this.allowUpdate){
            this.allowUpdate = true;
            return;
        }
        this.broadcastStatus.innerText= 'Đang lưu...';
        this.btnSend.disabled = true;
        this.autoSave(this.props.broadcast._id, this.state.broadcast);
    }
    countCustomer(){
        axios.get(baseURL + '/'+ ACCOUNT_ID + '/countCustomer')
        .then((response) =>{
            this.setState({
                countCustomer: response.data.count
            })
        });
    }
    handleToggleFilter(){
        this.allowUpdate = false;
        this.setState({
            isFilter: !this.state.isFilter
        });
    }
    handleToggleSearch(){
        this.allowUpdate = false;
        this.setState({
            isSearch: !this.state.isSearch
        });
    }
    handleMessageType(event){
        const broadcast = this.state.broadcast;
        if(event.target.value == 'MESSAGE_TAG'){
            broadcast.message_tag = "NON_PROMOTIONAL_SUBSCRIPTION";
        }
        broadcast.message_type = event.target.value;
        this.props.handleChangeMessageType(event.target.value);
        this.setState({
            broadcast: broadcast
        });
    }
    handleSchedule(event){
        const broadcast = this.state.broadcast;
        broadcast.schedule = event.target.value;
        this.setState({
            broadcast: broadcast
        });
    }
    handleNotification(type){
        const broadcast = this.state.broadcast;
        broadcast.notification = type;
        this.setState({
            broadcast: broadcast
        });
    }
    handleScheduleTime(time){
        const broadcast = this.state.broadcast;
        broadcast.schedule_at = time;
        this.setState({
            schedule_at: time,
            broadcast: broadcast
        });
    }
    autoSave(broadcastId, broadcast){
        const broadcastClone = JSON.parse(JSON.stringify(broadcast));
        delete broadcastClone.flow;
        axios.put(baseURL+'/'+ACCOUNT_ID+'/broadcast/saveBroadcast/'+broadcastId, { broadcast: broadcastClone})
        .then(() => {
            this.broadcastStatus.innerText = 'Đã lưu';
            this.btnSend.disabled = false;
        });
    }
    render() {
        var isSchedule = this.state.broadcast.schedule === 'true';
        var isMessageUpdate = this.state.broadcast.message_type === 'UPDATE' ? true : false;
        return (
            <ScrollBar className="broadcast-body">
                <div className="broadcast-setting">
                    <div className="row setting-item">
                        <div className="col-3">
                            <span className="font-weight-bold">Gửi tin nhắn đến</span>
                        </div>
                        <div className="col-9">
                            <div className="setting-item_desc">
                                {this.state.broadcast.message_type === 'MESSAGE_TAG' ?
                                    <span className="filter-user" onClick={this.handleToggleSearch.bind(this)}>{this.state.countCustomer} người dùng</span>
                                :
                                    <span className="filter-user" onClick={this.handleToggleFilter.bind(this)}>{this.props.filterCustomer.customerId.length} người dùng</span>
                                }
                            </div>
                            {this.state.isFilter ? 
                                <FilterUser 
                                    broadcast={this.state.broadcast}
                                    filterCustomer={this.props.filterCustomer}
                                    handleToggleFilter={this.handleToggleFilter.bind(this)}
                                    handleFilterCustomer={this.props.handleFilterCustomer.bind(this)}
                                    handleRemoveAllCustomer={this.props.handleRemoveAllCustomer.bind(this)}
                                    handleAddCustomer={this.props.handleAddCustomer.bind(this)}
                                    handleRemoveCustomer={this.props.handleRemoveCustomer.bind(this)}
                                />
                            : (this.state.isSearch ?
                                <SearchUser handleToggleSearch={this.handleToggleSearch.bind(this)}/>
                            : null)}
                        </div>
                    </div>
                    <div className="row setting-item">
                        <div className="col-3">
                            <span className="font-weight-bold">Loại tin nhắn</span>
                        </div>
                        <div className="col-9">
                            <label className="cs-radio">
                                <input type="radio" name="message_tpye" value="MESSAGE_TAG" onChange={this.handleMessageType.bind(this)} defaultChecked={!isMessageUpdate}/>
                                <span className="cs-radio_check"></span>
                                Tin nhắn thông thường
                            </label>
                            <div className="setting-item_desc gray">
                                Là tin nhắn không được chứa quảng cáo và tài liệu quảng cáo, tuy nhiên có thể gửi bất cứ lúc nào.
                            </div>
                            <label className="cs-radio">
                                <input type="radio" name="message_tpye" value="UPDATE" onChange={this.handleMessageType.bind(this)} defaultChecked={isMessageUpdate}/>
                                <span className="cs-radio_check"></span>
                                Tin nhắn quảng cáo
                            </label>
                            <div className="setting-item_desc gray">
                                Là tin nhắn bao gồm tin nhắn quảng cáo và tin nhắn không phải quảng cáo được gửi trong khoảng thời gian nhắn tin tiêu chuẩn 24 giờ.
                                Tìm hiểu <a href="https://developers.facebook.com/docs/messenger-platform/policy/policy-overview#standard_messaging">thời gian nhắn tin tiêu chuẩn 24 giờ</a> là gì.
                            </div>
                        </div>
                    </div>
                    <div className="row setting-item">
                        <div className="col-3">
                            <span className="font-weight-bold">Đặt lịch</span>
                        </div>
                        <div className="col-9">
                            <label className="cs-radio">
                                <input type="radio" name="schedule" value="false" onChange={this.handleSchedule.bind(this)} defaultChecked={!isSchedule}/>
                                <span className="cs-radio_check"></span>
                                Gửi ngay lập tức
                            </label>
                            <label className="cs-radio">
                                <input type="radio" name="schedule" value="true" onChange={this.handleSchedule.bind(this)} defaultChecked={isSchedule}/>
                                <span className="cs-radio_check"></span>
                                Đặt lịch gửi vào lúc
                            </label>
                            {isSchedule ?
                                <DatePicker
                                    selected={this.state.schedule_at}
                                    className="input-schedule"
                                    onChange={this.handleScheduleTime}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={1}
                                    dateFormat="DD-MM-YYYY hh:mm"
                                    timeCaption="Thời gian"
                                />
                            : null}
                        </div>
                    </div>
                    <div className="row setting-item">
                        <div className="col-3">
                            <span className="font-weight-bold">Loại thông báo</span>
                        </div>
                        <div className="col-9">
                            <div className="select-box pull-left">
                                <span>{this.state.broadcast.notification == 'REGULAR' ? 'Âm thanh & rung' : (this.state.broadcast.notification == 'SILENT_PUSH' ? 'Chỉ thông báo trên màn hình' : 'Im lặng')}</span>
                                <ul className="select-box-menu">
                                    <li onClick={() => this.handleNotification('REGULAR')}>Âm thanh & rung</li>
                                    <li onClick={() => this.handleNotification('SILENT_PUSH')} style={{whiteSpace: "nowrap"}}>Chỉ thông báo trên màn hình</li>
                                    <li onClick={() => this.handleNotification('NO_PUSH')}>Im lặng</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollBar>
        );
    }
}

export default BroadcastSetting;