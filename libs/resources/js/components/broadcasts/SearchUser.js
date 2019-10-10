import React, { Component } from 'react';
import ScrollBar from 'simplebar-react';

class SearchUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: {
                list: [],
                skip: 0,
                total: 0
            }
        }
    }
    
    componentDidMount(){
        this.getCustomer();
        $('.simplebar-content').scroll(function(e){
            this.handleScroll(e);
        }.bind(this));
    }
    getCustomer(){
        const customers = this.state.customers;
        axios.get(baseURL+'/'+ACCOUNT_ID+'/getCustomers?skip='+customers.skip)
        .then((response) => {
            customers.list = response.data.customer;
            customers.skip = response.data.limit;
            customers.total = response.data.total;
            this.setState({
                customers: customers
            });
        });
    }
    handleScroll(event){
        if(event.target.scrollTop === event.target.scrollHeight - event.target.clientHeight){
            const customers = this.state.customers;
            if(customers.skip < customers.total){
                axios.get(baseURL + '/'+ACCOUNT_ID+'/getCustomers?skip='+customers.skip)
                .then((response) => {
                    customers.list = customers.list.concat(response.data.customers);
                    customers.skip += response.data.limit;
                    this.setState({
                        customers: customers
                    });
                })
            }
        }
    }
    render() {
        return (
            <div>
                <div className="over" onClick={this.props.handleToggleSearch}></div>
                <div className="search-menu">
                    <div className="filter-head">
                        <div className="title text-ellipsis">Danh sách người dùng</div>
                        <span className="closex" onClick={this.props.handleToggleSearch}></span>
                    </div>
                    <div className="filter-body">
                    <ScrollBar className="user-list">
                        {this.state.customers.list.length > 0 ? this.state.customers.list.map((customer, index) => {
                            return(
                                <div className="user-item" key={index}>
                                    <div className="user-avatar">
                                        <img src={customer.customer.picture}/>
                                    </div>
                                    <div className="user-name">
                                        {customer.customer.first_name + ' '+ customer.customer.last_name}
                                    </div>
                                </div>
                            )
                        }) : <div className="loading"></div> }
                    </ScrollBar>
                    </div>
                </div>
            </div>
        );
    }
}

export default SearchUser;