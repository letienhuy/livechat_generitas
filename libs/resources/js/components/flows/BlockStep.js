import React, { Component } from 'react';

class BlockStep extends Component {
    constructor(props) {
        super(props);
        this.stepItem = [];
        this.BlockStepList = this.BlockStepList.bind(this);
    }
    handleEditStepElement(event){
        var input = $(event.target).parent().children('input');
        $(event.target).parent().children('.block-step-input').toggle();
        input[0].disabled = false;
        input[0].focus();
        input[0].selectionStart = input[0].selectionEnd = input[0].value.length;
    }
    handleOnBlur(event){
        $(event.target).parent().children('.block-step-input').toggle();
        event.target.disabled = true;
        $(event.target).get(0).setSelectionRange(0,0);
    }
    BlockStepList(props){
        var className = "block-step-item";
        if(_.isEqual(this.props.selected, props.content))
            className += ' selected';
        return(
            <div className={className} onClick={(e) => this.props.onClick(e, props.content)}>
                <div className="block-step-input"></div>
                <input disabled defaultValue={props.content.name}
                    onChange={(e) => this.props.onChange(e, props.index)}
                    onBlur={this.handleOnBlur.bind(this)}
                />
                <button className="block-step-btn edit" onClick={this.handleEditStepElement.bind(this)}></button>
                {_.isEqual(this.props.root, props.content) ? null : <button className="block-step-btn delete" onClick={() => this.props.handleDeleteStepElement(props.content)}></button>}
            </div>
        )
    }
    render() {
        return (
            <div className="block-step pd-20">
                <div className="block-step-body">
                    <p className="mg-top-20 mg-bottom-10 font-weight-bold">Tin nhắn mở đầu:</p>
                    <this.BlockStepList key={0} index={0} root={this.props.root} content={this.props.root}/>
                    {this.props.flow.contents.length > 1 ?
                        <p className="mg-top-20 mg-bottom-10 font-weight-bold">Đính kèm:</p>
                    : null}
                    <div className="block-step-list">
                        {this.props.flow.contents ?
                            this.props.flow.contents.map((content, index) => {
                                if(index) return <this.BlockStepList key={index} index={index} root={this.props.root} content={content}/>;
                            })
                        : null}
                    </div>
                    <div className="block-step-create">
                        <button className="block-step-btn" onClick={() => this.props.handleCreateStepElement(false)}><i className="fa fa-plus-square-o"></i> Tạo bài đăng</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default BlockStep;