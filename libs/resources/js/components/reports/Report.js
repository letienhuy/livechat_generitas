import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import ReactHighcharts from 'react-highcharts';
import ScrollBar from 'simplebar-react';
import DatePicker from 'react-datepicker';
import  'react-datepicker/dist/react-datepicker.css';

class Report extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: moment().subtract(13, 'days'),
            endDate: moment(),
            type: 'total',
            loading: true,
            config : {
                chart: {
                    type: 'areaspline',
                    style: {
                        fontFamily: 'Roboto'
                    }
                },
                title: {
                    text: null
                },
                xAxis: {
                    categories: []
                },
                yAxis:{
                    title: {
                        text: null
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },
                plotOptions: {},
                series: []
            },
            configArea: {}
        } 
        this.loadReport = this.loadReport.bind(this);
        this.loadReportMessages = this.loadReportMessages.bind(this);
        this.loadReportUsers = this.loadReportUsers.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
        this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
    }
    componentDidMount(){
        this.loadReport(this.state.startDate, this.state.endDate);
    }

    loadReport(start, end){
        axios.get(baseURL + '/'+ACCOUNT_ID+'/report/loadReports?type='+this.state.type+'&from='+start.format('DD-MM-YYYY')+'&to='+end.format('DD-MM-YYYY'))
        .then((response) => {
            const config = this.state.config;
            config.chart.type = 'areaspline';
            config.title.text = response.data.title;
            config.xAxis.categories = response.data.categories;
            config.series = response.data.data;
            this.setState({
                config: config,
                configArea: {},
                loading: false
            });
        });
    }

    loadReportUsers(start, end){
        axios.get(baseURL + '/'+ACCOUNT_ID+'/report/loadReportUsers?type='+this.state.type+'&from='+start.format('DD-MM-YYYY')+'&to='+end.format('DD-MM-YYYY'))
        .then((response) => {
            const config = this.state.config;
            config.chart.type = 'areaspline';
            config.title.text = response.data.title;
            config.series = response.data.data;
            config.xAxis = {
                categories: response.data.categories,
                tickmarkPlacement: 'on',
                title: {
                    enabled: false
                }
            };
            const configArea = JSON.parse(JSON.stringify(config));
            configArea.chart.type = 'area';
            configArea.plotOptions.area = {
                stacking: 'percent',
                lineColor: '#ffffff',
                lineWidth: 1,
                marker: {
                    enabled: false
                }
            };
            configArea.tooltip = {
                pointFormat: '<span class="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} người dùng)'
            }
            configArea.plotOptions.series = {
                states: {
                    hover: {
                        enabled: false
                    }
                }
            };
            this.setState({
                config: config,
                configArea: configArea,
                loading: false
            });
        });
    }

    loadReportMessages(start, end){
        axios.get(baseURL + '/'+ACCOUNT_ID+'/report/loadReportMessages?type='+this.state.type+'&from='+start.format('DD-MM-YYYY')+'&to='+end.format('DD-MM-YYYY'))
        .then((response) => {
            const config = this.state.config;
            config.chart.type = 'areaspline';
            config.title.text = response.data.title;
            config.series = response.data.data;
            config.xAxis = {
                categories: response.data.categories,
                tickmarkPlacement: 'on',
                title: {
                    enabled: false
                }
            };
            const configArea = JSON.parse(JSON.stringify(config));
            configArea.chart.type = 'area';
            configArea.plotOptions.area = {
                stacking: 'percent',
                lineColor: '#ffffff',
                lineWidth: 1,
                marker: {
                    enabled: false
                }
            };
            configArea.tooltip = {
                pointFormat: '<span class="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} tin nhắn)'
            }
            configArea.plotOptions.series = {
                states: {
                    hover: {
                        enabled: false
                    }
                }
            };
            this.setState({
                config: config,
                configArea: configArea,
                loading: false
            });
        });
    }

    handleChangeReportType(type){
        this.setState({
            type: type,
            loading: true
        });
        this.handleFilter(type, this.state.startDate, this.state.endDate);
    }
    handleFilter(type, start, end){
        switch(type){
            case 'total':
                this.loadReport(start, end);
                break;
            case 'user':
                this.loadReportUsers(start, end);
                break;
            case 'message':
                this.loadReportMessages(start, end);
                break;
        }
    }

    handleChangeStartDate(date){
        this.setState({
            loading: true,
            startDate: date
        })
        this.handleFilter(this.state.type, date, this.state.endDate);
    }
    handleChangeEndDate(date){
        this.setState({
            loading: true,
            endDate: date
        })
        this.handleFilter(this.state.type, this.state.startDate, date);
    }
    render() {
        return (
            <div className="content" style={{minWidth: 990}}>
                <div className="cnt-head">
                    <div className="cnt-head">
                        <h1 className="cnt-head-title pull-left">Báo cáo</h1>
                        <ul className="breadcrumb pull-right">
                            <li className="breadcrumb-item"><i className="fa fa-home"></i></li>
                            <li className="breadcrumb-item"><a href="">Báo cáo</a></li>
                        </ul>
                    </div>
                </div>
                <div className="cnt-main">
                    <div className="report">
                        <div className="report-head">
                            <div className="select-box pull-left mg-10">
                                <span>Báo cáo tổng quan</span>
                                <ul className="select-box-menu">
                                    <li onClick={() => this.handleChangeReportType('total')}>Báo cáo tổng quan</li>
                                    <li onClick={() => this.handleChangeReportType('user')}>Thống kê người dùng</li>
                                    <li onClick={() => this.handleChangeReportType('message')}>Thống kê tin nhắn</li>
                                </ul>
                            </div>
                            <div className="report-filter pull-right mg-10">
                                <span>Từ</span>
                                <div className="select-date">
                                    <DatePicker 
                                        className="input-date text-center"
                                        dateFormat="DD-MM-YYYY"
                                        locale="vi-VN" 
                                        selected={this.state.startDate}
                                        selectsStart
                                        startDate={this.state.startDate}
                                        endDate={this.state.endDate} 
                                        onChange={this.handleChangeStartDate.bind(this)}
                                    />
                                </div>
                                <span>đến</span>
                                <div className="select-date">
                                    <DatePicker
                                        className="input-date text-center"
                                        dateFormat="DD-MM-YYYY"
                                        locale="vi-VN"
                                        selected={this.state.endDate}
                                        selectsEnd
                                        startDate={this.state.startDate}
                                        endDate={this.state.endDate} 
                                        onChange={this.handleChangeEndDate.bind(this)}
                                    />
                                </div>
                            </div>
                        </div>
                            {this.state.loading ?
                                <div ref={el => this.loading = el} className="loading"></div>
                            : 
                                <ScrollBar className="report-body">
                                    <ReactHighcharts config={this.state.config}/>
                                    {this.state.configArea.chart ? <ReactHighcharts config={this.state.configArea}/> : null}
                                </ScrollBar>
                            }
                    </div>
                </div>
            </div>
        );
    }
}

export default Report;
ReactDOM.render(<Report/>, document.getElementById('content'));