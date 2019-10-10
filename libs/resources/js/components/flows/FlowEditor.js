import React, { Component } from 'react';
import ScrollBar from 'simplebar-react';
import uniqid from 'uniqid';
import BlockStep from './BlockStep';
import BlockEditor from './BlockEditor';
import BlockPreview from './BlockPreview';

class FlowEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flow: false,
            selected: false,
            root: false,
            preview: false,
            history: [],
            keyboard: false
        }
        this.allowUpdate = false;
        this.delayUpdate = false;
        this.broadcastStatus = document.getElementById('broadcast-status');
        this.loadFlowContent = this.loadFlowContent.bind(this)
        this.autoSave = this.autoSave.bind(this);
    }
    componentDidMount(){
        this.loadFlowContent(this.props.flow._id);
        this.btnSave = document.getElementById('btn-broadcast-save');
        $(document).on('mouseup', function(e){
            var blockKeyboard = $('.block-keyboard span');
            var editorKeyboardAction = $('.editor-keyboard-action *');
            if(blockKeyboard.is(e.target) || editorKeyboardAction.is(e.target)) return;
            this.allowUpdate = false;
            this.setState({
                keyboard: false
            });
            $('.editor-keyboard-action').hide();
        }.bind(this));
    }
    componentDidUpdate(preProps, preStates){
        if(!this.allowUpdate){
            this.allowUpdate = true;
            return;
        }
        clearTimeout(this.delayUpdate);
        this.broadcastStatus.innerText= 'Đang lưu...';
        this.btnSave.disabled = true;
        if(this.props.handleSaveFlowDraft){
            this.props.handleSaveFlowDraft(this.state.flow);
        }
        this.delayUpdate = setTimeout(() => {
            this.autoSave(this.state.flow);
        }, 2000);
    }
    componentWillReceiveProps(props){
        if(props.checkContentEmpty && props.checkContentEmpty.content){
            this.allowUpdate = false;
            this.setState({
                selected: props.checkContentEmpty.content
            }, () =>{
                props.checkContentEmpty.listDataId.map(id => {
                    $(document.getElementById(id)).animate({
                        borderColor: '#f00'
                    });
                    $(document.getElementById(id)).delay(2000).animate({
                        borderColor: '#eee'
                    });
                });
                props.checkContentEmpty.listKeyboardId.map(id => {
                    $(document.getElementById(id)).animate({
                        borderColor: '#f00'
                    });
                    $(document.getElementById(id)).delay(2000).animate({
                        borderColor: '#ddd'
                    });
                });
            });
        }
    }
    loadFlowContent(flowId){
        axios.get(baseURL+'/'+ACCOUNT_ID+'/flow/loadFlowContent/'+flowId)
        .then((response) => {
            this.allowUpdate = false;
            var selected = response.data.flow.contents.find(e => _.isEqual(e, response.data.flow.root_content));
            this.setState({
                flow: response.data.flow,
                selected: selected,
                root: selected,
                preview: response.data.flow.root_content
            },() =>{
                if(this.props.handleSaveFlowDraft){
                    this.props.handleSaveFlowDraft(response.data.flow);
                }
            });
        });
    }

    //Begin block element
    handleAddTextBlockElement(){
        const data = {
            _id: uniqid(),
            type: "text",
            content: {
                text: null,
            },
            keyboard: []
        }
        const selected = this.state.selected;
        const preview = this.state.preview;
        selected.data.push(data);
        preview.data.push(JSON.parse(JSON.stringify(data)));
        this.setState({
            selected: selected,
            preview: preview
        })
    }

    handleAddButtonElement(data){
        const selected = this.state.selected;
        const preview = this.state.preview;
        let length = parseInt(data.keyboard.length.toString());
        const keyboard = {
            _id: uniqid('ACT:'),
            type: "postback",
            caption: 'Nút #'+(++length),
            flow_content_id: null
        }
        var previewData = preview.data.find(e => _.isEqual(e, data));
        var selectedData = selected.data.find(e => _.isEqual(e, data));
        selectedData.keyboard.push(keyboard);
        previewData.keyboard.push(JSON.parse(JSON.stringify(keyboard)));
        this.setState({
            selected: selected,
            preview: preview
        });
    }

    handleButtonElement(event, keyboard){
        this.allowUpdate = false;
        this.setState({
            keyboard: keyboard
        });
        $('.editor-keyboard-action').show().css({
            top: $(event.target).parent().parent().parent().position().top
        });
        $('.select-box span').text('Chọn hành động');
    }

    handleButtonConnectElement(event, keyboard){
        const preview = this.state.preview;
        const history = this.state.history;
        if(keyboard.flow_content_id != null){
            var selected = this.state.flow.contents.find(e => e.content_id === keyboard.flow_content_id);
            if(selected){
                const data = {
                    type: "text",
                    reply: true,
                    content: {
                        text: keyboard.caption,
                    },
                    keyboard: []
                }
                preview.data.push(data);
                preview.data = preview.data.concat(JSON.parse(JSON.stringify(selected.data)));
                history.push(JSON.parse(JSON.stringify(this.state.selected)));
                this.allowUpdate = false;
                this.setState({
                    selected: selected,
                    preview: preview,
                    history: history,
                    keyboard: false
                });
            }
            $('.editor-keyboard-action').hide();
            return;
        }
        this.allowUpdate = false;
        this.setState({
            keyboard: keyboard
        });
        $('.editor-keyboard-action').show().css({
            top: $(event.target).parent().parent().parent().position().top
        });
        $('.select-box span').text('Chọn hành động');
    }

    //keyboard
    handleKeyboardActionOnChange(target){
        const keyboard = this.state.keyboard;
        const preview = this.state.preview;
        _.each(preview.data, (data) =>{
            var keyboardPreview = data.keyboard.find(e => _.isEqual(e, keyboard));
            if(keyboardPreview){
                keyboardPreview.caption = target.value;
                return false;
            }
        });
        keyboard.caption = target.value;
        this.setState({
            preview: preview,
            keyboard: keyboard
        });
    }
    handleDeleteKeyboard(keyboard){
        const flow = this.state.flow;
        const selected = this.state.selected;
        const preview = this.state.preview;
        var connectedStep = flow.contents.find(e => e.content_id === keyboard.flow_content_id);
        _.each(selected.data, (data) => {
            _.remove(data.keyboard, (key) => {
                return _.isEqual(key, keyboard);
            });
        });
        _.each(preview.data, (data) => {
            _.remove(data.keyboard, (key) => {
                return _.isEqual(key, keyboard);
            });
        });
        if(connectedStep){
            _.remove(connectedStep.connected_buttons, (btn) => {
                return _.isEqual(btn, keyboard._id);
            });
        }
        this.setState({
            flow: flow,
            selected: selected,
            preview: preview,
            keyboard: false
        }, () => {
            $('.editor-keyboard-action').hide();
        });
    }
    handleCloseKeyboard(){
        this.setState({
            keyboard: false
        });
        $('.editor-keyboard-action').hide();
    }
    handleLinkToStep(content, isDelete){
        const keyboard = this.state.keyboard;
        const flow = this.state.flow;
        if(keyboard.flow_content_id){
            var connectedStep = flow.contents.find(e => e.content_id === keyboard.flow_content_id);
            _.remove(connectedStep.connected_buttons, (btn) =>{
                return _.isEqual(btn, keyboard._id);
            });
        }
        if(isDelete){
            _.remove(content.connected_buttons, (btn) =>{
                return _.isEqual(btn, keyboard._id);
            });
            keyboard.flow_content_id = null;
        }else{
            keyboard.flow_content_id = content.content_id;
            content.connected_buttons.push(keyboard._id);
        }
        this.setState({
            flow: flow,
            keyboard: keyboard
        })
    }
    //end keyboard

    handleTextElementOnChange(e, dataIndex){
        const selected = this.state.selected;
        const preview = this.state.preview;
        const data = selected.data[dataIndex];
        data.content = {
            text : e.target.value
        }
        const previewData = preview.data.find(e => _.isEqual(e._id, data._id));
        previewData.content = {
            text : e.target.value
        }
        this.setState({
            selected: selected,
            preview: preview
        });
    }
    handleDeleteElement(data){
        const selected = this.state.selected;
        const preview = this.state.preview;
        _.remove(selected.data, (e) =>{
            return _.isEqual(e, data);
        });
        _.remove(preview.data, (e) =>{
            return _.isEqual(e, data);
        });
        this.setState({
            selected: selected,
            preview: preview
        });
    }
    handleCloneElement(data){
        const flow = this.state.flow;
        const selected = this.state.selected;
        const preview = this.state.preview;
        var cloneData = JSON.parse(JSON.stringify(data));
        var cloneDataId = uniqid();
        cloneData._id = cloneDataId;
        _.each(cloneData.keyboard, (keyboard)=>{
            var newKeyboardId = uniqid('ACT:');
            var connectedStep = flow.contents.find(e => e.content_id === keyboard.flow_content_id);
            if(connectedStep){
                connectedStep.connected_buttons.push(newKeyboardId);
            }
            keyboard._id = newKeyboardId;
        });
        selected.data.push(cloneData);
        preview.data.push(JSON.parse(JSON.stringify(cloneData)));
        this.setState({
            flow: flow,
            selected: selected,
            preview: preview
        });
    }
    //End block element

    //Begin step
    handleStepClick(event, selected){
        let targetName = event.target.tagName.toUpperCase();
        if(targetName == 'BUTTON') return false;
        this.allowUpdate = false;
        this.setState({
            selected: selected,
            preview: JSON.parse(JSON.stringify(selected)),
            history: []
        })
    }
    handleStepOnChange(event, index){
        const flow = this.state.flow;
        flow.contents[index].name = event.target.value;
        this.setState({
            flow: flow
        });
    }
    handleCreateStepElement(keyboard){
        let contentId = uniqid();
        let data = {
            content_id: contentId,
            flow_id: this.props.flow._id,
            name: "Tin nhắn #"+this.state.flow.contents.length,
            data: [	
                {
                    _id: uniqid(),
                    type: "text",
                    content	:{
                        text: null
                    },
                    keyboard: [],
                }
            ],
            connected_buttons: []
        }
        const newFlow = this.state.flow;
        if(keyboard){
            if(keyboard.flow_content_id){
                var connectedStep = newFlow.contents.find(e => e.content_id === keyboard.flow_content_id);
                _.remove(connectedStep.connected_buttons, (btn) =>{
                    return _.isEqual(btn, keyboard._id);
                });
            }
            keyboard.flow_content_id = contentId;
            this.setState({
                keyboard: keyboard
            });
            data.connected_buttons.push(keyboard._id);
        }
        newFlow.contents.push(data);
        this.setState({
            flow: newFlow
        })
        
    }
    handleDeleteStepElement(stepElement){
        const flow = this.state.flow;
        _.remove(flow.contents, (e) =>{
            return _.isEqual(e, stepElement);
        });
        axios.delete(baseURL+'/'+ACCOUNT_ID+'/flow/removeFlowContent/'+stepElement.content_id);
        _.each(flow.contents, (flowContent) => {
            flowContent.data.map((data) => {
                _.each(data.keyboard, (keyboard) =>{
                    if(keyboard.flow_content_id === stepElement.content_id)
                        keyboard.flow_content_id = null;
                });
            })
        });
        if(_.isEqual(this.state.selected, stepElement)){
            this.setState({
                flow: flow,
                selected: this.state.root,
                preview: JSON.parse(JSON.stringify(this.state.root)),
                history: []
            });
        }
        this.allowUpdate= false;
        this.broadcastStatus.innerText = "Đang lưu...";
        this.btnSave.disabled = true;
        this.autoSave(flow);
        this.setState({
            flow: flow
        });
    }
    //End Step

    handleHistoryBack(){
        const history = this.state.history;
        const preview = this.state.preview;
        var backHistory = history.pop();
        var lastBackHistory = JSON.parse(JSON.stringify(backHistory)).data.pop();
        var lastBackDataId = preview.data.reverse().findIndex(e => _.isEqual(e, lastBackHistory));
        var selected = this.state.flow.contents.find(e => _.isEqual(e, backHistory));
        console.log(lastBackHistory);
        console.log(selected);
        preview.data.splice(0, lastBackDataId);
        preview.data.reverse();
        this.allowUpdate = false;
        this.setState({
            preview: preview,
            selected: selected,
            history: history
        })
    }
    autoSave(flow){
        axios.put(baseURL+'/'+ACCOUNT_ID+'/flow/saveFlow/'+flow._id, { flow: flow})
        .then((response) => {
            this.broadcastStatus.innerText = 'Đã lưu';
            this.btnSave.disabled = false;
        });
    }
    render() {
        return (
            <ScrollBar className="broadcast-body">
            <div className="broadcast-editor">
                {this.state.root ?
                    <BlockStep flow={this.state.flow} root={this.state.root} selected={this.state.selected}
                        onClick={this.handleStepClick.bind(this)}
                        onChange={this.handleStepOnChange.bind(this)}
                        handleDeleteStepElement={this.handleDeleteStepElement.bind(this)}
                        handleCreateStepElement={this.handleCreateStepElement.bind(this)}
                    />
                : null}
                {this.state.selected ?
                    <BlockEditor flow={this.state.flow} root={this.state.root}
                        selected={this.state.selected}
                        keyboard={this.state.keyboard}
                        history={this.state.history}
                        handleStepClick={this.handleStepClick.bind(this)}
                        handleHistoryBack={this.handleHistoryBack.bind(this)}
                        handleAddButtonElement={this.handleAddButtonElement.bind(this)}
                        handleButtonElement={this.handleButtonElement.bind(this)}
                        handleButtonConnectElement={this.handleButtonConnectElement.bind(this)}
                        handleKeyboardActionOnChange={this.handleKeyboardActionOnChange.bind(this)}
                        handleDeleteKeyboard={this.handleDeleteKeyboard.bind(this)}
                        handleCloseKeyboard={this.handleCloseKeyboard.bind(this)}
                        handleLinkToStep={this.handleLinkToStep.bind(this)}
                        handleAddTextBlockElement={this.handleAddTextBlockElement.bind(this)}
                        handleTextElementOnChange = {this.handleTextElementOnChange.bind(this)}
                        handleDeleteElement={this.handleDeleteElement.bind(this)}
                        handleCloneElement={this.handleCloneElement.bind(this)}
                        handleCreateStepElement={this.handleCreateStepElement.bind(this)}
                    />
                : null}
                {this.state.selected ?
                    <BlockPreview
                        preview={this.state.preview}
                        page={this.props.page}/>
                : null}
            </div>
            </ScrollBar>
        );
    }
}

export default FlowEditor;