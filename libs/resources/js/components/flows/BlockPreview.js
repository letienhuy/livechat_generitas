import React, { Component } from 'react';
import ScrollBar from 'simplebar-react';
import ContentEditable from 'react-contenteditable';

class BlockPreview extends Component {
    componentWillReceiveProps(props){
        $('.monitor-body_list .simplebar-content').animate({scrollTop: $('.monitor-body_list .simplebar-content').prop('scrollHeight')});
    }
    render() {
        return (
            <div className="block-preview">
                <div className="preview">
                    <div className="phone-camera"></div>
                    <div className="phone-circle"></div>
                    <div className="phone-speaker"></div>
                    <div className="phone-monitor">
                        <div className="monitor-head">
                            <span className="back">Trở về</span>
                            <span className="name">
                                <p>{this.props.page.name} <i className="fa fa-angle-right"></i> </p>
                                <small>Thường trả lời ngay</small>
                            </span>
                            <span className="manage">Quản lý</span>
                        </div>
                        <div className="monitor-body">
                            <ScrollBar className="monitor-body_list">
                            {this.props.preview.data.map((data, index) => {
                                switch(data.type){
                                    case 'text':
                                        if(data.reply){
                                            return(
                                                <div className="msg-item reply" key={index}>
                                                    <div className="avatar"></div>
                                                    <div className="msg-text">
                                                        <div className="caption">
                                                            <ContentEditable disabled={true} html={data.content.text ? data.content.text : ""}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        let className = data.keyboard.length === 0 ? "msg-item only-text" : "msg-item";
                                        return(
                                            <div className={className} key={index}>
                                                <div className="avatar"></div>
                                                <div className="msg-text">
                                                    <div className="caption">
                                                        <ContentEditable disabled={true} html={data.content.text ? data.content.text : ""}/>
                                                    </div>
                                                    {data.keyboard.map((btn, index) => {
                                                        return(
                                                            <div key={index} className="keyboard">{btn.caption}</div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )
                                }
                            })}
                        </ScrollBar>
                        </div>
                    </div>
                    <div className="phone-home"></div>
                </div>
        </div>
        );
    }
}

export default BlockPreview;