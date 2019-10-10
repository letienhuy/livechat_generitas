import React, { Component } from 'react';

class UserInfo extends Component {
    render() {
        return (
            <div className="user-info">
                <div className="user-info-head">
                    THÔNG TIN KHÁCH HÀNG
                </div>
                <div className="user-info-list" data-simplebar>
                    <div className="user-info-item">
                        <div className="user-info-icon">
                            <i className="icon-icon-user2"></i>
                        </div>
                        <p>{this.props.current.customer.first_name} {this.props.current.customer.last_name}</p>
                    </div>
                    <div className="user-info-item">
                        <div className="user-info-icon">
                            <i className="icon-icon-telephone"></i>
                        </div>
                        <p>
                            {this.props.current.customer.phone ?
                                this.props.current.customer.phone.map((num, k) => {
                                    return(
                                        <span key={k}>{num}, </span>
                                    )
                                })
                            : "Chưa có"}
                        </p>
                    </div>
                    <div className="user-info-item">
                        <div className="user-info-icon">
                            <i className="fa fa-envelope-o"></i>
                        </div>
                        <p>
                            {this.props.current.customer.email ?
                                this.props.current.customer.email.map((email, k) => {
                                    return(
                                        <span key={k}>{email}, </span>
                                    )
                                })
                            : "Chưa có"}
                        </p>
                    </div>
                    <div className="user-info-item">
                        <div className="user-info-icon">
                            <i className="icon-icon-address"></i>
                        </div>
                        <p>{this.props.current.customer.location}</p>
                    </div>
                    <div className="user-info-item">
                        <div className="user-info-icon">
                            <i className="icon-icon-clock"></i>
                        </div>
                        <p>{this.props.current.updated_at}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserInfo;