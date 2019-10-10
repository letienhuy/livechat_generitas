import React, { Component } from 'react';
import TextElement from './elements/TextElement';
import KeyboardAction from './elements/KeyboardAction';

class BlockEditor extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className="block-editor">
                <div className="editor-head">
                {this.props.history.length === 0 ? null : <span className="back" onClick={this.props.handleHistoryBack}></span>}
                    {this.props.selected.name}
                </div>
                <div className="editor-body">
                    <div className="editor-element">
                        {this.props.selected.data.map((data, index) => {
                            switch(data.type){
                                case 'text':
                                    return(
                                        <TextElement key={index} index={index} data={data}
                                            keyboard={this.props.keyboard}
                                            handleAddButtonElement={this.props.handleAddButtonElement}
                                            handleButtonElement={this.props.handleButtonElement}
                                            handleButtonConnectElement={this.props.handleButtonConnectElement}
                                            handleDeleteElement={this.props.handleDeleteElement}
                                            handleCloneElement={this.props.handleCloneElement}
                                            onChange={this.props.handleTextElementOnChange}
                                        />
                                    )
                            }
                        })}
                    </div>
                    <KeyboardAction flow={this.props.flow} root={this.props.root} content={this.props.selected}
                        keyboard={this.props.keyboard}
                        onChange={this.props.handleKeyboardActionOnChange}
                        handleCreateStepElement={this.props.handleCreateStepElement}
                        handleDeleteKeyboard={this.props.handleDeleteKeyboard}
                        handleCloseKeyboard={this.props.handleCloseKeyboard}
                        handleLinkToStep={this.props.handleLinkToStep}
                    />
                    <div className="editor-action">
                        <div className="quick-reply"><i className="fa fa-plus-square-o"></i> Trả lời nhanh</div>
                        <ul>
                            <li className="editor-action-btn" onClick={this.props.handleAddTextBlockElement}><i className="fa fa-align-left"></i> +Văn bản</li>
                            <li className="editor-action-btn"><i className="fa fa-picture-o"></i> +Hình ảnh</li>
                            <li className="editor-action-btn"><i className="fa fa-caret-square-o-right"></i> +Video</li>
                            <li className="editor-action-btn"><i className="fa fa-paperclip"></i> +Tệp đính kèm</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default BlockEditor;