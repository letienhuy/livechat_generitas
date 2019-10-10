import React, { Component } from 'react';     

class KeyboardAction extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="editor-keyboard-action">
            {this.props.keyboard ?
                <div className="editor-keyboard-action_editor">
                    <input ref={el => this.text = el} type="text" value={this.props.keyboard.caption} onChange={() => this.props.onChange(this.text)}/>
                    <span className="mg-top-20 mg-bottom-10 font-weight-bold">Hành động</span>
                        {this.props.flow.contents.map((content, key) => {
                            if(_.isEqual(content.content_id, this.props.keyboard.flow_content_id))
                                return(
                                    <div key={key} className="keyboard-action">
                                        {content.name}
                                        <span onClick={() => this.props.handleLinkToStep(content, true)}>
                                            <i className="fa fa-times"></i>
                                        </span>
                                    </div>
                                )
                        })}
                    <div className="select-box d-block">
                        <span>Chọn hành động</span>
                        <ul className="select-box-menu">
                            {this.props.flow.contents.map((content, index) => {
                                if(_.isEqual(content, this.props.root) || _.isEqual(content, this.props.content)) return false;
                                return(
                                    <li key={index} onClick={() => this.props.handleLinkToStep(content)}>{content.name}</li>
                                )
                                
                            })}
                        </ul>
                    </div>
                    <span className="mg-top-10 mg-bottom-10 font-weight-bold">hoặc</span>
                    <div className="keyboard-action-list">
                        <span onClick={() => this.props.handleCreateStepElement(this.props.keyboard)}>Gửi tin nhắn</span>
                    </div>
                </div>
                : null
            }
                <button className="btn btn-sm btn-delete" onClick={() => this.props.handleDeleteKeyboard(this.props.keyboard)}>Xoá nút</button>
                <button className="btn btn-sm btn-light" style={{position: 'absolute', bottom: '5', right: 5}} onClick={this.props.handleCloseKeyboard}>Đóng</button>
            </div>
        );
    }
}

export default KeyboardAction;