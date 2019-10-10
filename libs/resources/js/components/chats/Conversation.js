import React, { Component } from 'react';
import ScrollBar from 'simplebar-react';

class Conversation extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        $('.simplebar-content').scroll(function(e){
            this.props.onScroll(e, $('.chat-list .simplebar-content')[0]);
        }.bind(this));
    }
    toggleCheckAll(event){
        $('.chat-item_checkbox input').prop('checked', $(event.target).prop('checked'));
    }
    render() {
        return (
            <div className="chat">
                <div className="chat-head">
                    <div className="chat-select-box mg-right-10 pull-left">
                        <div className="cs-checkbox chk-sm">
                            <input type="checkbox" onChange={this.toggleCheckAll.bind(this)}/>
                            <span className="cs-checkbox_check"></span>
                        </div>
                    </div>
                    <div className="chat-select-box pull-left">
                        <button className="select-drop" data-target-id="#select-drop_menu1">Tất cả</button>
                        <ul id="select-drop_menu1" className="select-drop_menu">
                            <li onClick={(event) => this.props.handleFilterConversation(event, 'all')}>Tất cả</li>
                            <li onClick={(event) => this.props.handleFilterConversation(event, 'unread')}>Chưa đọc</li>
                            <li onClick={(event) => this.props.handleFilterConversation(event, 'is_done')}>Đã xong</li>
                        </ul>
                    </div>
                    <div className="chat-select-box pull-right">
                        <button className="select-drop" data-target-id="#select-drop_menu2">Mới nhất</button>
                        <ul id="select-drop_menu2" className="select-drop_menu select-drop_menu_right">
                            <li onClick={(event) => this.props.handleSortConversation(event, 'desc')}>Mới nhất</li>
                            <li onClick={(event) => this.props.handleSortConversation(event, 'asc')}>Cũ nhất</li>
                        </ul>
                    </div>
                </div>
                <div className="chat-scroll"></div>
                <ScrollBar className="chat-list">
                    {this.props.conversation.list.map((con, k) => {
                        let className = "chat-item";
                        className = con._id == this.props.current._id ? className + ' item-selected' : className;
                        className = !con.is_read ? className + ' unread' : className;
                        return(
                            <div key={k} id={con._id} className={className} onClick={(e) => this.props.onClick(e, con)}>
                                <div className="chat-item_checkbox pull-left">
                                    <div className="cs-checkbox chk-sm chk-disabled">
                                        <input type="checkbox" name="conversation_id[]" value={con._id}/>
                                        <span className="cs-checkbox_check"></span>
                                    </div>
                                </div>
                                <div className="chat-item_picture pull-left">
                                    <img src={con.customer.picture} alt=""/>
                                </div>
                                <div className="chat-item_name">
                                    {con.customer.first_name} {con.customer.last_name}
                                </div>
                            </div>
                        )
                    })}
                </ScrollBar>
            </div>
        );
    }
}

export default Conversation;