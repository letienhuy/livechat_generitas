import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import BroadcastList from './BroadcastList';
import BroadcastEditor from './BroadcastEditor';
import BroadcastHistory from './BroadcastHistory';

class Broadcast extends Component {
    constructor(props) {
        super(props);
        this.state = {
            admin: {},
            page: {}
        }
    }
    componentDidMount(){
        this.getPage(PAGE_ID);
    }
    getPage(pageId){
        axios.get(baseURL + '/fb'+pageId+'/getPage')
        .then(response => {
            this.setState({
                page: response.data.page,
                admin: response.data.admin
            });
        });
    }
    render() {
        return (
            <Router basename={ACCOUNT_ID+'/broadcast'}>
                <div className="content">
                    <div className="cnt-head">
                        <div className="cnt-head">
                            <h1 className="cnt-head-title pull-left">Gửi tin nhắn</h1>
                            <ul className="breadcrumb pull-right">
                                <li className="breadcrumb-item"><i className="fa fa-home"></i></li>
                                <li className="breadcrumb-item"><Link to="/">Gửi tin nhắn</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="cnt-main">
                        <Route exact path="/" component={BroadcastList}/>
                        <Route path="/draft/:id" render={(props) => <BroadcastEditor {...props} page={this.state.page} />}/>
                        <Route path="/history/:id" render={(props) => <BroadcastHistory {...props} page={this.state.page} />}/>
                    </div>
                </div>
            </Router>
        );
    }
}
export default Broadcast;

ReactDOM.render(<Broadcast/>, document.getElementById('content'));


