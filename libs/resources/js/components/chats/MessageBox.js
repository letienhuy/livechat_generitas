import React, { Component } from 'react';
import ScrollBar from 'simplebar-react';
import Countdown from 'react-countdown-now';

class MessageBox extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        $('.simplebar-content').scroll(function(e){
            this.props.onScroll(e, $('.message-list .simplebar-content')[0]);
        }.bind(this));
    }
    
    toggleImage(event){
        var img = $(event.target).attr('src');
        $('<img/>').attr('src', img).appendTo($('<div/>').addClass('message-image').appendTo('body'));
     }
    getFilename(url){
         var matches = url.match(/\/([^\/?#]+)[^\/]*$/);
         if (matches.length > 1) {
             return matches[1];
         }
         return null;
    }
    render() {
        let toggleBotClass = "message-bot-btn";
        toggleBotClass = this.props.current.paused_bot && this.props.current.paused_bot.status ? toggleBotClass : toggleBotClass + " pause";
        const renderer = ({ hours, minutes, seconds, completed }) => {
            return <span>{hours}:{minutes}:{seconds}</span>;
        };
        return (
            <div className="message">
                <div className="message-box">
                    <div className="message-head">
                        <div className="message-head_picture pull-right">
                            <img src={this.props.current.customer.picture} alt=""/>
                        </div>
                        <div className="message-head_name">
                            {this.props.current.customer.first_name} {this.props.current.customer.last_name}
                        </div>
                    </div>
                    <div className="message-bot">
                        {this.props.current.paused_bot && this.props.current.paused_bot.status ? <span className="text-center"><Countdown 
                            date={this.props.current.paused_bot.paused_at + 1800000} onComplete={this.props.toggleAuto}
                            renderer={renderer}/></span> : null }
                        <button className={toggleBotClass+" pull-right"} onClick={this.props.toggleAuto}></button>
                    </div>
                    <ScrollBar className="message-list">
                        {this.props.message.list.map((mess, key) => {
                            let className = "message-item";
                            className = mess.type == "msgin" ? className : className + ' reply';
                            let picture = mess.type == "msgin" ? this.props.message.conversation.customer.picture : (mess.type == "msgout_bot" ? baseURL + '/images/bot.png' : baseURL + '/images/user.png');
                            return(
                                <div key={key} className={className}>
                                    <div className="message-item_picture">
                                        <img src={picture} alt=""/>
                                    </div>
                                    <div className="message-item_content">
                                        { mess.attachments ?
                                            mess.attachments.map((attachment, key) => {
                                                switch(attachment.type){
                                                    case "image":
                                                        return(
                                                            <ul key={key}>
                                                                <li onClick={this.toggleImage.bind(this)}>
                                                                    <img src={attachment.payload.url}/>
                                                                </li>
                                                            </ul>
                                                        )
                                                    case "file":
                                                        return(
                                                            <div key={key} className="message-item_text">
                                                                <i className="fa fa-paperclip"></i> <a href={attachment.payload.url}>{this.getFilename(attachment.payload.url)}</a>
                                                            </div>
                                                        )
                                                    case "template":
                                                        switch(attachment.payload.template_type){
                                                            case "button":
                                                            return(
                                                                <div key={key} className="message-attachment">
                                                                    <div className="message-attachment_head">{mess.text}</div>
                                                                    <div className="message-attachment_cnt">
                                                                        {attachment.payload.buttons.map((item, key) => {
                                                                            return(
                                                                                <button key={key} disabled>{item.title}</button>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            )
                                                            case "generic":
                                                            return(
                                                                attachment.payload.elements.map((element, key) => {
                                                                    return(
                                                                        <div key={key} className="message-attachment">
                                                                            <div className="message-attachment_head">{element.title}</div>
                                                                            <div className="message-attachment_cnt">
                                                                                {element.buttons.map((item, key) => {
                                                                                    return(
                                                                                        <button key={key} disabled>{item.title}</button>
                                                                                    )
                                                                                })}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })
                                                            )
                                                            default:
                                                            break;
                                                        }
                                                    default:
                                                        return(
                                                            <div key={key} className="message-item_text">Không thể tải tệp đính kèm</div>
                                                        )
                                                }
                                            })
                                        : 
                                            <div className="message-item_text">{mess.text}</div>
                                        }
                                    </div>
                                </div>
                            )
                        })}
                    </ScrollBar>
                    <form className="message-input" onSubmit={(e) => this.props.handleSubmitMessage(e, this.inputMessage, $('.message-list .simplebar-content')[0])}>
                        <button className="pull-right">
                            <i className="fa fa-paper-plane"></i>
                        </button>
                        <div className="input">
                            <input type="text" ref={(e) => this.inputMessage = e} placeholder="Nhập câu trả lời" onKeyPress={this.props.onKeyPress}/>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default MessageBox;