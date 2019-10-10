import React, { Component } from 'react';
import ContentEditable from 'react-contenteditable';

class TextElement extends Component {
    constructor(props) {
        super(props);
    }
    onFocus(event){
        this.text.classList.add('focus');
    }
    onBlur(event){
        this.text.classList.remove('focus');
    }
    render() {
        if(this.props.isHistory){
            var elTextClass = this.props.data.keyboard.length > 0 ? "element-block-text" : "element-block-text bottom";
            return(
                <div className="element-block">
                <div className={elTextClass}>
                    <span>{this.props.data.content.text ? this.props.data.content.text.replace(/<br\s*[\/]?>/gi, "") : null}</span>
                </div>
                <div className="element-block-keyboard">
                    {this.props.data.keyboard ? 
                        this.props.data.keyboard.map((btn, key) =>{
                            let className = "block-keyboard";
                            if(_.isEqual(btn, this.props.keyboard))
                                className = className + ' selected';
                            return(
                                <div key={key} className={className} id={btn._id}>
                                    <span>{btn.caption}</span>
                                    <span className={"block-keyboard_connect"+ (btn.flow_content_id ? ' connected' : '')} onClick={() => this.props.handleButtonConnect(btn)}></span>
                                </div>
                            )
                        })  
                    : null}
                </div>
            </div>
            )
        }
        return (
            <div className="element-block element-block-editor">
                <div id={this.props.data._id} className="element-block-text" ref={el => this.text = el}>
                    <ContentEditable html={this.props.data.content.text ? this.props.data.content.text : "<br>"}
                        disabled={false}
                        onChange={(e) => this.props.onChange(e, this.props.index)}
                        tagName='span'
                        onBlur={this.onBlur.bind(this)}
                        onFocus={this.onFocus.bind(this)}
                    />
                </div>
                <div className="element-block-keyboard">
                    {this.props.data.keyboard ? 
                        this.props.data.keyboard.map((btn, key) =>{
                            let className = "block-keyboard";
                            if(_.isEqual(btn, this.props.keyboard))
                                className = className + ' selected';
                            return(
                                <div key={key} className={className} id={btn._id}>
                                    <span onClick={(e) => this.props.handleButtonElement(e, btn)}>{btn.caption}</span>
                                    <span className={"block-keyboard_connect"+ (btn.flow_content_id ? ' connected' : '')} onClick={(e) => this.props.handleButtonConnectElement(e, btn)}></span>
                                </div>
                            )
                        })  
                    : null}
                    {this.props.data ?
                    this.props.data.keyboard.length < 3 ?
                        <div className="block-keyboard bottom" onClick={() => this.props.handleAddButtonElement(this.props.data)}>
                            <span><i className="fa fa-plus-square-o"></i> Thêm</span>
                        </div>
                        : null
                    : null}
                </div>
                <button className="element-block-delete" onClick={() => this.props.handleDeleteElement(this.props.data)}>
                    <i className="fa fa-times"></i>
                </button>
                <button className="element-block-clone" onClick={() => this.props.handleCloneElement(this.props.data)}>
                    <i className="fa fa-clone"></i>
                </button>
            </div>
        );
    }
}

export default TextElement;