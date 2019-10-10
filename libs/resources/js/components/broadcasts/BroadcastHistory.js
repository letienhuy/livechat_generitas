import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import ScrollBar from 'react-scrollbar';
import moment from 'moment';
import TextElement from '../flows/elements/TextElement';

class BroadcastHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            broadcast: {},
            flow: false,
            selected: false,
            root: false,
            redirect: {
                status: false,
                redirectTo: null
            },
            toggleStep: false
        }
        this.BlockStepList = this.BlockStepList.bind(this);
    }
    componentDidMount(){
        this.loadBroadcastHistory(this.props.match.params.id);
    }
    loadBroadcastHistory(broadcastId){
        axios.get(baseURL+'/'+ACCOUNT_ID+'/broadcast/loadHistoryBroadcast/'+broadcastId)
        .then((response) => {
            var firstResponse = response;
            this.setState({
                broadcast: firstResponse.data.broadcast
            });
            axios.get(baseURL+'/'+ACCOUNT_ID+'/flow/loadFlowContent/'+response.data.broadcast.flow_id)
            .then((response) => {
                var secondeResponse = response;
                this.setState({
                    flow: secondeResponse.data.flow,
                    selected: secondeResponse.data.flow.root_content,
                    root: secondeResponse.data.flow.root_content,
                });
            })
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
    BlockStepList(props){
        var className = "block-step-item";
        if(_.isEqual(this.state.selected, props.content))
            className += ' selected';
        return(
            <div className={className} onClick={() => props.onClick(props.content)}>
                <span className="text-ellipsis">{props.content.name}</span>
            </div>
        )
    }
    handleStepClick(selected){
        this.setState({
            selected: selected
        });
    }
    handleButtonConnect(btn){
        var selected = this.state.flow.contents.find(e => e.content_id === btn.flow_content_id);
        if(selected){
            this.setState({
                selected: selected
            });
        }
    }
    handleCloneBroadcast(broadcastElement){
        const broadcast = this.state.broadcast;
        axios.post(baseURL+'/'+ACCOUNT_ID+'/broadcast/cloneBroadcast/'+broadcastElement._id)
        .then((response) =>{
            this.setState({
                redirect: {
                    status: true,
                    redirectTo: "/draft/"+response.data.broadcast._id
                }
            });
        });
    }
    render() {
        if(this.state.redirect.status) return <Redirect to={this.state.redirect.redirectTo}/>;
        return (
            <div className="broadcast">
                <div className="broadcast-head pd-10">
                    <button id="btn-broadcast-send" className="btn btn-sm pull-right mg-right-10" onClick={() => this.handleCloneBroadcast(this.state.broadcast)}><i className="fa fa-clone"></i> Sao chép & Sửa</button>
                </div>
                {this.state.flow ?
                    <ScrollBar smoothScrolling={true} className="broadcast-body" contentClassName="broadcast-editor">
                                <div className="block-step pd-20">
                                    <div className="tab-control">
                                        <div className="tab-head">
                                            <span data-target="#tab-1" className="active">Thông tin</span>
                                            <span data-target="#tab-2" className="">Nội dung</span>
                                        </div>
                                        <div className="tab-body">
                                            <div id="tab-1" className="tab-body-container active">
                                                <ul className="broadcast-history-info mg-top-10">
                                                    <li>
                                                        <span>Đã gửi</span>
                                                        <span><i className="fa fa-calendar"></i>{moment(this.state.broadcast.updated_at).format('DD-MM-YYYY HH:mm')}</span>
                                                        <hr/>
                                                    </li>
                                                    <li>
                                                        <span>Loại tin nhắn</span>
                                                        <span><i className="fa fa-tag"></i>{this.state.broadcast.message_type == 'UPDATE' ? 'Tin nhắn quảng cáo' : 'Tin nhắn thông thường'}</span>
                                                    </li>
                                                    <li>
                                                        <span>Loại thông báo</span>
                                                        <span><i className="fa fa-bell-o"></i>{this.state.broadcast.notification == 'REGULAR' ? 'Thông báo chuông & rung' : (this.state.broadcast.notification == 'NO_PUSH' ? 'Chỉ hiển thị trên màn hình' : 'Im lặng')}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div id="tab-2" className="tab-body-container ">
                                                <div className="block-step-body">
                                                    <p className="mg-top-20 mg-bottom-10 font-weight-bold">Tin nhắn mở đầu:</p>
                                                    <this.BlockStepList key={0} index={0} root={this.state.root} content={this.state.root} onClick={this.handleStepClick.bind(this)}/>
                                                    {this.state.flow.contents.length > 1 ?
                                                        <p className="mg-top-20 mg-bottom-10 font-weight-bold">Đính kèm:</p>
                                                    : null}
                                                    <div className="block-step-list">
                                                        {this.state.flow.contents ?
                                                            this.state.flow.contents.map((content, index) => {
                                                                if(index) return <this.BlockStepList key={index} index={index} root={this.state.root} content={content} onClick={this.handleStepClick.bind(this)}/>;
                                                            })
                                                        : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="block-editor">
                                    <div className="editor-head">
                                        {this.state.flow.name}
                                    </div>
                                    <div className="editor-body">
                                        <div className="editor-element">
                                            {this.state.selected.data.map((data, index) => {
                                                switch(data.type){
                                                    case 'text':
                                                        return(
                                                            <TextElement key={index} index={index} data={data} isHistory={true} handleButtonConnect={this.handleButtonConnect.bind(this)}/>
                                                        )
                                                }
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="block-preview">
                                </div>
                    </ScrollBar>
                : <div className="loading"></div>
                }
            </div>
        );
    }
}

export default BroadcastHistory;