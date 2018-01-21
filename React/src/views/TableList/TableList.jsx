import React, { Component } from 'react';
import axios from 'axios';
import { Grid, Row, Col, Table } from 'react-bootstrap';

import Card from '../../components/Card/Card.jsx';
import {thArray, tdArray} from '../../variables/Variables.jsx';

class TableList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fetchInfo:{
                familyListCol: ["ID","Name","Code","Calendar"],
                userListCol: ["ID","Name","Code","Calendar"],
                familyListDb : [[]],
                userListDb : [[]]
            }
        }
        this.fetchInfo = this.fetchInfo.bind(this);
      }

      fetchInfo() {
        axios.get('http://localhost:1337/admin/dbInfo')
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

    componentWillMount(){
        this.fetchInfo();
    }

    render() {
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title="Family Table"
                                category="MongoDB"
                                ctTableFullWidth ctTableResponsive
                                content={
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                {
                                                    this.state.fetchInfo.familyListCol.map((prop, key) => {
                                                        return (
                                                        <th  key={key}>{prop}</th>
                                                        );
                                                    })
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                 this.state.fetchInfo.familyListDb.map((prop,key) => {
                                                    return (
                                                        <tr key={key}>{
                                                            prop.map((prop,key)=> {
                                                                return (
                                                                    <td  key={key}>{prop}</td>
                                                                );
                                                            })
                                                        }</tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                }
                            />
                        </Col>
                                

                        <Col md={12}>
                            <Card
                                plain
                                title="User Table"
                                category="MongoDB"
                                ctTableFullWidth ctTableResponsive
                                content={
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                {
                                                   this.state.fetchInfo.userListCol.map((prop, key) => {
                                                        return (
                                                        <th  key={key}>{prop}</th>
                                                        );
                                                    })
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.fetchInfo.userListDb.map((prop,key) => {
                                                    return (
                                                        <tr key={key}>{
                                                            prop.map((prop,key)=> {
                                                                return (
                                                                    <td  key={key}>{prop}</td>
                                                                );
                                                            })
                                                        }</tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                }
                            />
                        </Col>

                    </Row>
                </Grid>
            </div>
        );
    }
}

export default TableList;
