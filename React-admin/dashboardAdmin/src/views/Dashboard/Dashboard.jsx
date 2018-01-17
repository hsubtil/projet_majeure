import React, { Component } from 'react';
import axios from 'axios';
import ChartistGraph from 'react-chartist';
import { Grid, Row, Col } from 'react-bootstrap';


import {Card} from 'components/Card/Card.jsx';
import {StatsCard} from 'components/StatsCard/StatsCard.jsx';
import {Tasks} from 'components/Tasks/Tasks.jsx';
import {
    dataPie,
    legendPie,
    dataSales,
    optionsSales,
    responsiveSales,
    legendSales,
    optionsBar,
    responsiveBar,
    legendBar
} from 'variables/Variables.jsx';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
        fetchInfo: {
            upTime:'',
            errorNb: '',
            logEntry:'',
            dbCapacity: '',
            dbObjects:'',
            socketConnected: ''
          },
        fetchServicesInfo:{
            labels: ['Chateee', 'Family', 'Profile', 'GoogleCalendar', 'Auth', 'Meteo'],
            series: [
              [542, 443, 320, 365, 553, 453]
            ]
          }
        }
        this.fetchInfo = this.fetchInfo.bind(this);
        this.fetchServicesInfo = this.fetchServicesInfo.bind(this);
      }
    
      fetchInfo() {
        axios.get('http://localhost:1337/admin/info')
          .then( (response) => {
            console.log("response", response);
            this.setState({
                fetchInfo: response.data
            });
            console.log("fetchInfo", this.state.fetchInfo);
          })
          .catch( (error) => {
            console.log(error);
          });  
      }

      fetchServicesInfo() {
        axios.get('http://localhost:1337/admin/services')
          .then( (response) => {
            console.log("response services", response);
            this.setState({
                fetchServicesInfo: response.data
            });
            console.log("fetchServicesInfo", this.state.fetchServicesInfo);
          })
          .catch( (error) => {
            console.log(error);
          });  
      }


    createLegend(json){
        var legend = [];
        for(var i = 0; i < json["names"].length; i++){
            var type = "fa fa-circle text-"+json["types"][i];
            legend.push(
                <i className={type} key={i}></i>
            );
            legend.push(" ");
            legend.push(
                json["names"][i]
            );
        }
        return legend;
    }

    

    componentWillMount(){
        this.fetchInfo();
        this.fetchServicesInfo();
    }


    render() {
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<i className="pe-7s-timer text-success"></i>}
                                statsText="Uptime"
                                statsValue={this.state.fetchInfo.upTime}
                                statsIcon={<i className="fa fa-refresh"></i>}
                                statsIconText="Updated now"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<i className="pe-7s-usb text-success"></i>}
                                statsText="Number of sockets"
                                statsValue={this.state.fetchInfo.socketConnected}
                                statsIcon={<i className="fa fa-refresh"></i>}
                                statsIconText="Updated now"
                            />
                        </Col>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<i className="pe-7s-graph1 text-danger"></i>}
                                statsText="Errors"
                                statsValue={this.state.fetchInfo.errorNb}
                                statsIcon={<i className="fa fa-refresh"></i>}
                                //statsIcon={<i className="fa fa-clock-o"></i>}
                                statsIconText="Updated now"
                            />
                        </Col>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<i className="pe-7s-tools text-success"></i>}
                                statsText="Log entry"
                                statsValue={this.state.fetchInfo.logEntry}
                                statsIcon={<i className="fa fa-refresh"></i>}
                                //statsIcon={<i className="fa fa-clock-o"></i>}
                                statsIconText="Updated now"
                            />
                        </Col>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<i className="fa fa-twitter text-info"></i>}
                                statsText="Followers"
                                statsValue="+0"
                                statsIcon={<i className="fa fa-refresh"></i>}
                                statsIconText="Updated now"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<i className="pe-7s-server text-warning"></i>}
                                statsText="DB Capacity"
                                statsValue={this.state.fetchInfo.dbCapacity}
                                statsIcon={<i className="fa fa-refresh"></i>}
                                statsIconText="Updated now"
                            />
                        </Col>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<i className="pe-7s-server text-warning"></i>}
                                statsText="DB objects"
                                statsValue={this.state.fetchInfo.dbObjects}
                                statsIcon={<i className="fa fa-refresh"></i>}
                                statsIconText="Updated now"
                            />
                        </Col>
                    </Row>
                    {/*
                    <Row>
                        <Col md={8}>
                            <Card
                                statsIcon="fa fa-history"
                                id="chartHours"
                                title="Users Behavior"
                                category="24 Hours performance"
                                stats="Updated 3 minutes ago"
                                content={
                                    <div className="ct-chart">
                                        <ChartistGraph
                                            data={dataSales}
                                            type="Line"
                                            options={optionsSales}
                                            responsiveOptions={responsiveSales}
                                        />
                                    </div>
                                    }
                                legend={
                                    <div className="legend">
                                        {this.createLegend(legendSales)}
                                    </div>
                                }
                            />
                        </Col>
                        <Col md={4}>
                            <Card
                                statsIcon="fa fa-clock-o"
                                title="Email Statistics"
                                category="Last Campaign Performance"
                                stats="Campaign sent 2 days ago"
                                content={
                                    <div id="chartPreferences" className="ct-chart ct-perfect-fourth">
                                        <ChartistGraph data={dataPie} type="Pie"/>
                                    </div>
                                }
                                legend={
                                    <div className="legend">
                                        {this.createLegend(legendPie)}
                                    </div>
                                }
                            />
                        </Col>
                            </Row>*/}

                    <Row>
                        <Col md={6}>
                            <Card
                                id="usersActivity"
                                title="Users Activity"
                                category="All requests"
                                stats="Data information certified"
                                statsIcon="fa fa-check"
                                content={
                                    <div className="ct-chart">
                                        <ChartistGraph
                                            data={this.state.fetchServicesInfo}
                                            type="Bar"
                                            options={optionsBar}
                                            responsiveOptions={responsiveBar}
                                        />
                                    </div>
                                }
                               /*} legend={
                                    <div className="legend">
                                        {this.createLegend(legendBar)}
                                    </div>
                                }*/
                            />
                        </Col>

                        <Col md={6}>
                            <Card
                                title="Tasks"
                                category="Backend development"
                                stats="Updated 3 minutes ago"
                                statsIcon="fa fa-history"
                                content={
                                    <div className="table-full-width">
                                        <table className="table">
                                            <Tasks />
                                        </table>
                                    </div>
                                }
                            />
                        </Col>
                    </Row>

                </Grid>
            </div>
        );
    }
}

export default Dashboard;
