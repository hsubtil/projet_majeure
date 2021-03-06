import React, { Component } from 'react';
import axios from 'axios';
import ChartistGraph from 'react-chartist';
import { Grid, Row, Col } from 'react-bootstrap';


import {Card} from '../../components/Card/Card.jsx';
import {StatsCard} from '../../components/StatsCard/StatsCard.jsx';
import {
    optionsBar,
    responsiveBar
} from '../../variables/Variables.jsx';

import CONFIG from '../../config.json';


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
            dbRequest:'',
            socketConnected: ''
          },
        fetchServicesInfo:{
            labels: ['Chat', 'Family', 'Profile', 'GoogleCalendar', 'Auth', 'Meteo'],
            series: [
              [0, 0, 0, 0, 0, 0]
            ]
          }
        }
        this.fetchInfo = this.fetchInfo.bind(this);
        this.fetchServicesInfo = this.fetchServicesInfo.bind(this);
      }

    
      fetchInfo() {
            axios.get('http://'+ CONFIG.nodeserver +':' + CONFIG.port + '/admin/info')
            .then( (response) => {
                //console.log("response", response);
                this.setState({
                    fetchInfo: response.data
                });
               // console.log("fetchInfo", this.state.fetchInfo);
            })
            .catch( (error) => {
                console.log(error);
            });  
      }

      fetchServicesInfo() {
        axios.get('http://'+ CONFIG.nodeserver +':' + CONFIG.port + '/admin/services')
          .then( (response) => {
            //console.log("response services", response);
            this.setState({
                fetchServicesInfo: response.data
            });
            //console.log("fetchServicesInfo", this.state.fetchServicesInfo);
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
        setInterval(this.fetchInfo , 1000);
        setInterval(this.fetchServicesInfo , 1000);
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
                    </Row>
                    <Row>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<i className="pe-7s-server text-warning"></i>}
                                statsText="DB Size"
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
                    </Row>

                </Grid>
            </div>
        );
    }
}

export default Dashboard;
