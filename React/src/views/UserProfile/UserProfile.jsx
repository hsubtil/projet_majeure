import React, { Component } from 'react';
import axios from 'axios';
import {
    Grid, Row, Col,
    FormGroup, ControlLabel, FormControl
} from 'react-bootstrap';

import {Card} from '../../components/Card/Card.jsx';
import {FormInputs} from '../../components/FormInputs/FormInputs.jsx';
import {UserCard} from '../../components/UserCard/UserCard.jsx';
import Button from '../../elements/CustomButton/CustomButton.jsx';
import NotificationSystem from 'react-notification-system';
import {style} from "../../variables/Variables.jsx";

import avatar from "../../assets/img/default-avatar.png";

import CONFIG from '../../config.json';

class UserProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            _notificationSystem: null,
            searchValue : "",
            fetchInfo:{
                email: "",
                name: "",
                surname: "",
                address: "",
                cp: "",
                city: "",
                country: ""
            },
            name:"",
            surname:"",
            address:"",
            city:"",
            country:"",
            cp:""         
        }
       // this.fetchInfo = this.fetchInfo.bind(this);
       this.postUserRequest = this.postUserRequest.bind(this);
       this.handleChange = this.handleChange.bind(this);
       this.handleNameChange = this.handleNameChange.bind(this);
       this.handleSurnameChange = this.handleSurnameChange.bind(this);
       this.handleAddressChange = this.handleAddressChange.bind(this);
       this.handleCityChange = this.handleCityChange.bind(this);
       this.handleCountryChange = this.handleCountryChange.bind(this);
       this.handleCpChange = this.handleCpChange.bind(this);
       this.handleSubmit = this.handleSubmit.bind(this);
      // this.handleClick = this.handleClick.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
      }

    componentDidMount(){
        this.setState({_notificationSystem: this.refs.notificationSystem});
    }

    handleSubmit(){
        console.log("handleSubmit");

        axios.post('http://'+ CONFIG.nodeserver +':' + CONFIG.port + '/admin/updateProfil',{'email':this.state.searchValue,'profil':this.state.fetchInfo})
          .then( (response) => {
            console.log("response", response);
            // Affichage pop up
            //this.handleClick(this.state._notificationSystem,'tl');
            //var _notificationSystem = this.refs.notificationSystem;
            var _notificationSystem = this.refs.notificationSystem;
            _notificationSystem.addNotification({
                title: (<span data-notify="icon" className="pe-7s-check"></span>),
                message: (
                    <div>
                        <b>{this.state.searchValue}</b> updated.
                    </div>
                ),
                level: 'success',
                position: "tc",
                autoDismiss: 15,
            });          
          })
          .catch( (error) => {
            console.log(error);
            var _notificationSystem = this.refs.notificationSystem;
            _notificationSystem.addNotification({
                title: (<span data-notify="icon" className="pe-7s-attention"></span>),
                message: (
                    <div>
                        <b>Error</b> during update.
                    </div>
                ),
                level: 'error',
                position: "tc",
                autoDismiss: 15,
            }); 
          }); 
    }

      postUserRequest() {
          console.log("postUserRequest");
          console.log(this.state.searchValue);
        axios.post('http://'+ CONFIG.nodeserver +':' + CONFIG.port + '/admin/userInfo',{'email':this.state.searchValue})
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
        this.setState({fetchInfo:{name: e.target.value, surname: this.state.fetchInfo.surname, address:this.state.fetchInfo.address ,
            cp:this.state.fetchInfo.cp ,city: this.state.fetchInfo.city,country:this.state.fetchInfo.country }});
      }
      handleSurnameChange(e){
        this.setState({fetchInfo:{name: this.state.fetchInfo.name, surname: e.target.value, address:this.state.fetchInfo.address ,
            cp:this.state.fetchInfo.cp ,city: this.state.fetchInfo.city,country:this.state.fetchInfo.country }});
      }
      handleAddressChange(e){
        this.setState({fetchInfo:{name: this.state.fetchInfo.name, surname: this.state.fetchInfo.surname, address: e.target.value ,
            cp:this.state.fetchInfo.cp ,city: this.state.fetchInfo.city,country:this.state.fetchInfo.country }});
      }
      handleCityChange(e){
        this.setState({fetchInfo:{name: this.state.fetchInfo.name, surname: this.state.fetchInfo.surname, address:this.state.fetchInfo.address ,
            cp:this.state.fetchInfo.cp ,city: e.target.value,country:this.state.fetchInfo.country }});
      }
      handleCountryChange(e){
        this.setState({fetchInfo:{name: this.state.fetchInfo.name, surname:this.state.fetchInfo.surname, address:this.state.fetchInfo.address ,
            cp:this.state.fetchInfo.cp ,city: this.state.fetchInfo.city,country:e.target.value }});
      }
      handleCpChange(e){
        this.setState({fetchInfo:{name: this.state.fetchInfo.name, surname:this.state.fetchInfo.surname, address:this.state.fetchInfo.address ,
            cp:e.target.value ,city: this.state.fetchInfo.city,country:this.state.fetchInfo.country }});
      }


    render() {
        return (
            <div className="content">            
            <NotificationSystem ref="notificationSystem" style={style}/>
                <Grid fluid>
                    <Row>
                        <Col md={8}>
                        <Card
                            title="Search User"
                            content={
                                <form>
                                    <FormInputs
                                        ncols = {["col-md-8"]}                                        
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
                                    
                                   <Button fill onClick={this.postUserRequest}>
                                        <i className="pe-7s-search"></i>
                                    </Button> 
                                </form>   
                            }                     
                        />                        
                            <Card
                                title="Edit User Profile"
                                content={
                                    <form>
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
                                                 onChange:this.handleSurnameChange,
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
                                                    onChange:this.handleAddressChange,
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
                                                    onChange:this.handleCityChange,
                                                    defaultValue : ""
                                                },
                                                {
                                                    label : "Country",
                                                    type : "text",
                                                    bsClass : "form-control",
                                                    placeholder : "Country",
                                                    value :this.state.fetchInfo.country,
                                                    onChange:this.handleCountryChange,
                                                    defaultValue : ""
                                                },
                                                {
                                                    label : "Postal Code",
                                                    type : "number",
                                                    bsClass : "form-control",
                                                    placeholder : "ZIP Code",
                                                    onChange:this.handleCpChange,
                                                    value :this.state.fetchInfo.cp
                                                }
                                            ]}
                                        />
                                        <Button
                                            bsStyle="info"
                                            pullRight
                                            fill
                                            onClick={this.handleSubmit}
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
