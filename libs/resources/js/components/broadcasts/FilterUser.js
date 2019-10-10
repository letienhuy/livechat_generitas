import React, { Component } from 'react';
import ScrollBar from 'simplebar-react';

class FilterUser extends Component {
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
        $(this.loading).show();
        const customers = this.state.customers;
        axios.get(baseURL+'/'+ACCOUNT_ID+'/getCustomers?skip='+customers.skip+'&message_type='+this.props.broadcast.message_type)
        .then((response) => {
            customers.list = response.data.customer;
            customers.skip = response.data.limit;
            customers.total = response.data.total;
            this.setState({
                customers: customers
            });
            $(this.loading).hide();
        });
    }
    handleScroll(event){
        if(event.target.scrollTop === event.target.scrollHeight - event.target.clientHeight){
            const customers = this.state.customers;
            if(customers.skip < customers.total){
                axios.get(baseURL +'/' +ACCOUNT_ID+ '/getCustomers?skip='+customers.skip)
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
    handleToggleAll(event){
        $('input[name=filter-checkbox]').prop('checked', event.target.checked);
        if(event.target.checked){
            $(event.target).parent().find('.cs-checkbox_text').text("Bỏ chọn hết");
            this.props.handleFilterCustomer(this.state.customers.list);
        }else{
            $(event.target).parent().find('.cs-checkbox_text').text("Chọn tất cả");
            this.props.handleRemoveAllCustomer();
        }
    }
    handleToggleCustomer(event, customer){
        if(event.target.checked){
            this.props.handleAddCustomer(customer);
        }else{
            this.props.handleRemoveCustomer(customer);
        }
    }
    render() {
        return (
            <div>
                <div className="over" onClick={this.props.handleToggleFilter}></div>
                <div className="filter-menu">
                    <div className="filter-head">
                        <div className="title text-ellipsis">Danh sách người dùng</div>
                        <span className="closex" onClick={this.props.handleToggleFilter}></span>
                    </div>
                    <div className="filter-body">
                    <div className="check-all">
                        <label className="cs-checkbox">
                            <input type="checkbox" onChange={this.handleToggleAll.bind(this)}/>
                            <span className="cs-checkbox_check"></span>
                            <span className="cs-checkbox_text">Chọn tất cả</span>
                        </label>
                    </div>
                    <ScrollBar className="user-list">
                        {this.state.customers.list.length > 0 ? this.state.customers.list.map((customer, index) => {
                            let checked = false;
                            let customerExist = this.props.filterCustomer.facebookId.find(e => e == customer.customer_id);
                            if(customerExist){
                                checked = true;
                            }
                            return(
                                <div className="user-item" key={index}>
                                    <label className="cs-checkbox pull-left">
                                        <input type="checkbox" name="filter-checkbox" defaultChecked={checked} onChange={(e) => this.handleToggleCustomer(e, customer)}/>
                                        <span className="cs-checkbox_check"></span>
                                    </label>
                                    <div className="user-avatar">
                                        <img src={customer.customer.picture}/>
                                    </div>
                                    <div className="user-name">
                                        {customer.customer.first_name + ' '+ customer.customer.last_name}
                                    </div>
                                </div>
                            )
                        }) : <p style={{position: "absolute", width: "100%", top: "calc(50% - 20px)", textAlign: "center"}}>Không có người dùng nào phù hợp</p> }
                        <div ref={el => this.loading = el} className="loading" style={{display: "none", backgroundColor: '#fff'}}></div>
                    </ScrollBar>
                    </div>
                </div>
            </div>
        );
    }
}

export default FilterUser;