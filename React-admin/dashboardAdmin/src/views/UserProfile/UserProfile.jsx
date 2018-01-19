import React, { Component } from 'react';
import axios from 'axios';
import {
    Grid, Row, Col,
    FormGroup, ControlLabel, FormControl
} from 'react-bootstrap';

import {Card} from 'components/Card/Card.jsx';
import {FormInputs} from 'components/FormInputs/FormInputs.jsx';
import {UserCard} from 'components/UserCard/UserCard.jsx';
import Button from 'elements/CustomButton/CustomButton.jsx';

import avatar from "assets/img/default-avatar.png";

class UserProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchValue : "",
            fetchInfo:{
                email: "",
                name: "",
                surname: "",
                address: "",
                cp: "",
                city: "",
                country: ""
            }
        }
       // this.fetchInfo = this.fetchInfo.bind(this);
       this.postUserRequest = this.postUserRequest.bind(this);
       this.handleChange = this.handleChange.bind(this);
       this.handleNameChange = this.handleNameChange.bind(this);
       this.handleSubmit = this.handleSubmit.bind(this);
      }

    handleSubmit(){
        console.log("handleSubmit");
        axios.post('http://localhost:1337/admin/updateProfil',{'profile':this.state.fetchInfo})
          .then( (response) => {
            console.log("response", response);
            // Affichage pop up
            console.log("Notif ?");
          })
          .catch( (error) => {
            console.log(error);
          }); 
    }

      postUserRequest() {
          console.log("postUserRequest");
          console.log(this.state.searchValue);
        axios.post('http://localhost:1337/admin/userInfo',{'email':this.state.searchValue})
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

      handleChange(e){
        this.setState({ searchValue: e.target.value });
      }

      handleNameChange(e){
        this.setState({ fetchInfo:{name: e.target.value }});
      }

    render() {
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={8}>
                        <Card
                            title="Search User"
                            content={
                                <form onSubmit={this.postUserRequest}>
                                    <FormInputs
                                        ncols = {["col-md-5"]}                                        
                                        proprieties = {[
                                            {
                                             label : "Email address",
                                             type : "email",
                                             bsClass : "form-control",                                             
                                             placeholder : "",
                                             onChange : this.handleChange
                                            }
                                        ]}
                                    />     
                                    <Button fill type="submit">
                                        <i className="pe-7s-search"></i>
                                    </Button>                               
                                </form>   
                            }                     
                        />


                        
                            <Card
                                title="Edit User Profile"
                                content={
                                    <form onSubmit={this.handleSubmit}>
                                        <FormInputs
                                            ncols = {["col-md-5"]}
                                            proprieties = {[
                                                {
                                                 label : "Email address",
                                                 type : "email",
                                                 bsClass : "form-control",
                                                 placeholder : "Email",
                                                 value :this.state.fetchInfo.email,
                                                 disabled : true
                                                }
                                            ]}
                                        />
                                        <FormInputs
                                            ncols = {["col-md-6" , "col-md-6"]}
                                            proprieties = {[
                                                {
                                                 label : "Name",
                                                 type : "text",
                                                 bsClass : "form-control",
                                                 placeholder : "Name",
                                                 value :this.state.fetchInfo.name,
                                                 onChange:this.handleNameChange,
                                                 defaultValue : ""
                                                },
                                                {
                                                 label : "Surname",
                                                 type : "text",
                                                 bsClass : "form-control",
                                                 placeholder : "Surname",
                                                 value :this.state.fetchInfo.surname,
                                                 defaultValue : ""
                                                }
                                            ]}
                                        />
                                        <FormInputs
                                            ncols = {["col-md-12"]}
                                            proprieties = {[
                                                {
                                                    label : "Adress",
                                                    type : "text",
                                                    bsClass : "form-control",
                                                    placeholder : "Home Adress",
                                                    value :this.state.fetchInfo.address,
                                                    defaultValue : ""
                                                }
                                            ]}
                                        />
                                        <FormInputs
                                            ncols = {["col-md-4","col-md-4","col-md-4"]}
                                            proprieties = {[
                                                {
                                                    label : "City",
                                                    type : "text",
                                                    bsClass : "form-control",
                                                    placeholder : "City",
                                                    value :this.state.fetchInfo.city,
                                                    defaultValue : ""
                                                },
                                                {
                                                    label : "Country",
                                                    type : "text",
                                                    bsClass : "form-control",
                                                    placeholder : "Country",
                                                    value :this.state.fetchInfo.country,
                                                    defaultValue : ""
                                                },
                                                {
                                                    label : "Postal Code",
                                                    type : "number",
                                                    bsClass : "form-control",
                                                    placeholder : "ZIP Code",
                                                    value :this.state.fetchInfo.cp
                                                }
                                            ]}
                                        />
                                        <Button
                                            bsStyle="info"
                                            pullRight
                                            fill
                                            type="submit"
                                        >
                                            Update Profile
                                        </Button>
                                        <div className="clearfix"></div>
                                    </form>
                                }
                            />
                        </Col>
                        <Col md={4}>
                            <UserCard
                                bgImage="https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"
                                avatar={avatar}
                                name={this.state.fetchInfo.name}
                                userName={this.state.fetchInfo.email}
                                socials={
                                    <div>
                                        <Button simple><i className="fa fa-facebook-square"></i></Button>
                                        <Button simple><i className="fa fa-twitter"></i></Button>
                                        <Button simple><i className="fa fa-google-plus-square"></i></Button>
                                    </div>
                                }
                            />
                        </Col>

                    </Row>
                </Grid>>
            </div>
        );
    }
}

export default UserProfile;
