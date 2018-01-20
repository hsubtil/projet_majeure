import React, { Component } from 'react';
import axios from 'axios';
import { Grid, Row, Col } from 'react-bootstrap';

import Card from 'components/Card/Card.jsx'

class Typography extends Component {
    constructor(props){
        super(props);
        this.state={
            value :""
        }
        this.getLog=this.getLog.bind(this);
    }
    
    getLog() {
        axios.get('http://localhost:1337/admin/log')
        .then( (response) => {
            console.log("response", response);
            this.setState({
                value: response.data
            });
            console.log("fetchInfo", this.state.fetchInfo);
        })
        .catch( (error) => {
            console.log(error);
        });  
    }

    
    componentWillMount(){
        this.getLog();
        //setInterval(this.fetchInfo , 1000);
    }

    render() {
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title="Log File"
                                content={
                                    <div>
                                        <div>
                                            {this.state.value.split("\n").map(i => {
                                                return <p className="category">{i}</p>;
                                            })}
                                        </div>
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

export default Typography;
