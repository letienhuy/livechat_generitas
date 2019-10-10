import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import ScrollBar from 'simplebar-react';
import Countdown from 'react-countdown-now';
import Paginate from 'react-paginate';
import moment from 'moment';

class BroadcastList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            broadcast: {
                list: [],
                lastPage: 1,
            },
            redirect: {
                status: false,
                redirectTo: null
            }
        }
        this.getBroadcast = this.getBroadcast.bind(this);
    }
    componentDidMount(){
        this.getBroadcast();
    }
    getBroadcast(){
        axios.get(baseURL + '/'+ ACCOUNT_ID + '/broadcast/getBroadcast')
        .then((response) =>{
            this.setState({
                broadcast: {
                    list: response.data.broadcast.data,
                    lastPage: response.data.broadcast.last_page
                }
            });
        });
    }
    handlePagination(paginate){
        axios.get(baseURL + '/'+ ACCOUNT_ID + '/broadcast/getBroadcast?page='+(++paginate.selected))
        .then((response) =>{
            this.setState({
                broadcast: {
                    list: response.data.broadcast.data,
                    lastPage: response.data.broadcast.last_page
                }
            });
        });
    }
    handleCreateBroadcast(){
        axios.post(baseURL + '/'+ ACCOUNT_ID + '/broadcast/createBroadcast')
        .then((response) =>{
            this.setState({
                redirect: {
                    status: true,
                    redirectTo: "/draft/"+response.data.broadcast_id
                }
            })
        });
    }
    handleBroadcast(event, broadcast){
        let targetName = event.target.tagName.toUpperCase();
        if(targetName == 'BUTTON') return false;
        const redirect = {
            status: true,
            redirectTo: "/draft/"+broadcast._id
        };
        if(broadcast.status === 'published'){
            redirect.redirectTo = "/history/"+broadcast._id;
        }
        this.setState({
            redirect: redirect
        });
        this.props.history.push(redirect.redirectTo);
    }
    handleCloneBroadcast(broadcastElement){
        const broadcast = this.state.broadcast;
        axios.post(baseURL+'/'+ACCOUNT_ID+'/broadcast/cloneBroadcast/'+broadcastElement._id)
        .then((response) =>{
            broadcast.list.unshift(response.data.broadcast);
            this.setState({
                broadcast: broadcast
            });
        });
    }
    handleDeleteBroadcast(broadcastElement){
        const broadcast = this.state.broadcast;
        _.remove(broadcast.list, (e) =>{
            return _.isEqual(e, broadcastElement);
        });
        this.setState({
            broadcast: broadcast
        });
        axios.delete(baseURL+'/'+ACCOUNT_ID+'/broadcast/removeBroadcast/'+broadcastElement._id);
    }
    render() {
        const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            return <span>Đã gửi</span>;
        }
            return <span>Gửi sau: {days} ngày, {hours}:{minutes}:{seconds}</span>;
        };
        if(this.state.redirect.status) return <Redirect to={this.state.redirect.redirectTo}/>
        return (
            <div className="broadcast">  
                <div className="broadcast-head pd-10">
                    <button className="btn btn-sm pull-right mg-right-10" onClick={this.handleCreateBroadcast.bind(this)}><i className="fa fa-plus-square-o"></i> Tạo mới</button>
                    <button className="btn btn-sm pull-right mg-right-10"><i className="fa fa-file-o"></i> Chiến dịch mẫu</button>
                </div>
                <ScrollBar className="broadcast-body">
                <div className="broadcast-list">
                    <p className="mg-bottom-10 font-weight-bold">Bản nháp:</p>
                    <table className="broadcast-list_item">
                        <thead>
                            <tr>
                                <th>Tên chiến dịch</th>
                                <th>Đã tạo</th>
                                <th>Trạng thái</th>
                                <th width="100">Đã gửi</th>
                                <th width="100">Đã đọc</th>
                                <th width="100">Clicks/CRT</th>
                                <th width="80"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.broadcast.list.map((broadcast, index) => {
                                return(
                                    <tr key={index} onClick={(e) => this.handleBroadcast(e, broadcast)}>
                                        <td>{broadcast.flow.name}</td>
                                        <td>{moment(broadcast.created_at).format('DD-MM-YYYY HH:mm')}</td>
                                        <td>{broadcast.status == 'draft' ? 'Nháp' : (broadcast.schedule == 'true' ? <Countdown date={broadcast.schedule_at} renderer={renderer}/> : 'Đã gửi')}</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>100%</td>
                                        <td className="text-right">
                                            <button className="broadcast-btn" onClick={() => this.handleCloneBroadcast(broadcast)}>
                                                <i className="fa fa-clone"></i>
                                            </button>
                                            {broadcast.status == 'published' ? null : 
                                                <button className="broadcast-btn remove" onClick={() => this.handleDeleteBroadcast(broadcast)}>
                                                    <i className="fa fa-trash"></i>
                                                </button>
                                            }
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <Paginate containerClassName="paginate" nextLabel="❯" previousLabel="❮" pageCount={this.state.broadcast.lastPage} onPageChange={this.handlePagination.bind(this)}/>
                </div>
                </ScrollBar>
            </div>
        );
    }
}

export default BroadcastList;