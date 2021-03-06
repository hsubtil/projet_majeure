import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import {Modal,FormGroup,Button,Form, ControlLabel, FormControl} from 'react-bootstrap';
import "../../node_modules/react-big-calendar/lib/css/react-big-calendar.css";
import ReactDOM from 'react-dom';
import NotificationSystem from 'react-notification-system';
import {style} from "../variables/Variables.jsx";

class Calendar extends React.Component {
    constructor(props) {
        super(props);

        console.log(props);
        this.state = {
        	googleEvents: [],
            user: localStorage.getItem("user"),
            code: localStorage.getItem("selectedgroup_code"),
            token: localStorage.getItem("token"),
            showModal: false,
            showModalEvent: false,
            idEvent: null,
            titleEvent: null,
            locationEvent: null,
            descriptionEvent: null,
            startDateTimeEvent: null,
            endDateTimeEvent: null,
            startDateTimeString: null,
            endDateTimeString: null,
            _notificationSystem: null

        };  
        this.socket =  props.socket.socket;        
    }

    componentWillMount(){
    	var self = this;
        
        BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
        
        this.socket.on('google_list_events_reply', function (data){
            console.log('google_list_events_reply');
            self.displayEvents(data, self);             
        }); 

    	this.socket.on('google_list_events_err', function (data){
            console.log('google_list_events_err');       
            //alert("Error while retrieving the events, please reload the page !");
            self.state._notificationSystem.addNotification({
                title: (<span data-notify="icon" className="pe-7s-close-circle"></span>),
                message: (
                    <div>
                        <b>Error while retrieving the events, please reload the page !</b>
                    </div>
                ),
                level: 'error',
                position: "tc",
                autoDismiss: 5,
            }); 
  
        });

        this.socket.on('google_set_event_err', function (data){
            console.log('google_set_event_err');
            //alert("Error while creating the event, please try again or reload the page !");
            self.state._notificationSystem.addNotification({
                title: (<span data-notify="icon" className="pe-7s-close-circle"></span>),
                message: (
                    <div>
                        <b>Error while creating the event, please try again or reload the page !</b>
                    </div>
                ),
                level: 'error',
                position: "tc",
                autoDismiss: 5,
            }); 

  
        });

        this.socket.on('google_set_event_reply', function (data){
            console.log('google_set_event_reply');
            //alert("Event successfully created!");
            self.state._notificationSystem.addNotification({
                title: (<span data-notify="icon" className="pe-7s-check"></span>),
                message: (
                    <div>
                        <b>Event successfully created !</b>
                    </div>
                ),
                level: 'success',
                position: "tc",
                autoDismiss: 5,
            }); 
            self.getListEvents(self.state.token, self.state.code);
  
        });
        this.socket.on('google_remove_event_err', function (data){
            console.log('google_remove_event_err');
            //alert("Error while removing the event, please try again or reload the page!");
            self.state._notificationSystem.addNotification({
                title: (<span data-notify="icon" className="pe-7s-close-circle"></span>),
                message: (
                    <div>
                        <b>Error while removing the event, please try again or reload the page !</b>
                    </div>
                ),
                level: 'error',
                position: "tc",
                autoDismiss: 5,
            }); 
  
        });

        this.socket.on('google_remove_event_success', function (data){
            console.log('google_remove_event_success');
            //alert("Event successfully deleted !");
            self.getListEvents(self.state.token, self.state.code);
            self.state._notificationSystem.addNotification({
                title: (<span data-notify="icon" className="pe-7s-check"></span>),
                message: (
                    <div>
                        <b>Event successfully deleted !</b>
                    </div>
                ),
                level: 'success',
                position: "tc",
                autoDismiss: 5,
            }); 
  
        });

        this.setEvent = this.setEvent.bind(this); 
        this.getListEvents = this.getListEvents.bind(this); 
        this.close = this.close.bind(this); 
        this.open = this.open.bind(this); 
        this.handleSubmit.bind(this);
        this.closeEvent = this.closeEvent.bind(this); 
        this.openEvent = this.openEvent.bind(this); 
        this.handleDeleteEvent.bind(this);
        this.componentDidMount.bind(this);


        
        this.getListEvents(this.state.token, this.state.code);

       // this.setEvent(this.state.token, this.state.code, "Alpes", "Ski", "fondue au programme",  new Date(2018, 0, 1), new Date(2018, 0, 3)); 
    }

    componentDidMount(){
        this.setState({
            _notificationSystem : this.refs.notificationSystem
        });
    }

    displayEvents(data, obj){
    	obj.state.googleEvents = []; 
        if(Object.keys(data[0]).length !== 0){
            Object.keys(data).forEach(function(key) {
                var val = data[key];
                var end = val['end']['dateTime'];
                var start = val['start']['dateTime'];
                var summary = val['summary'];
                var location = val['location'];
                var id = val['id'];
                var description = val['description'];          

    			console.log("summary: " + summary + ",start: " + start + ",end: " + end);
                console.log("location: " + location + ",id: " + id + ",description: " + description);
    			start = new Date(start);
    			end = new Date(end);

                obj.setState({
                    events: obj.state.googleEvents.push({
                        title: summary,
    	                startDate: start,
    	                endDate: end,
    	                location: location,	
                        id: id,  
                        description: description                  
                    })
                });
            }); 
        }
        else{
            obj.setState({
                    googleEvents: []
            });

        }
    }

    setEvent(token, code, location, summary, description, start_dateTime, end_DateTime) {
        console.log("setEvent");
 		console.log("location: " + location + ", summary: " + summary + ", description: " + description 
 			+ ", start_dateTime: " + start_dateTime + ", end_DateTime: " + end_DateTime );
        this.socket.emit('google_set_event', {
                "token": token
                , 'code': code
                , 'event' : {
								 'summary': summary,
								 'location': location,
								 'description': description,
								'start': {
								'dateTime': start_dateTime,
								 'timeZone': 'Europe/Paris',
								 },
								 'end': {
								'dateTime': end_DateTime,
								 'timeZone': 'Europe/Paris',
								 }
							}
            }) 
    }

     removeEvent(token, code, id) {
        console.log("removeEvent");
        console.log("id: " + id );
        this.socket.emit('google_remove_event', {
                "token": token
                , 'code': code
                , 'eventId': id              
            }) 
        this.getListEvents(this.state.token, this.state.code);
    }

    getListEvents(token, code) {
        console.log("getListEvents");
 		console.log(code);
        this.socket.emit('google_list_events', {
                "token": token
                , 'code': code
            }) 
    }

    close() {
        this.setState({ showModal: false });
    }

    open() {
        console.log("open");
        this.setState({ showModal: true });
     }

    closeEvent() {
        this.setState({ showModalEvent: false });
    }

    openEvent(event) {
        console.log("openEvent");
        console.log("event");
        console.log(event);
        console.log(this); 

        this.setState({ showModalEvent: true,
                        idEvent: event["id"],
                        titleEvent: event["title"],
                        locationEvent: event["location"],
                        descriptionEvent: event["description"],
                        startDateTimeEvent: event["startDate"],
                        endDateTimeEvent: event["endDate"],
                        startDateTimeString: event["startDate"].toString(),
                        endDateTimeString: event["endDate"].toString()
         });
     }

    handleSubmit(){

        if(ReactDOM.findDOMNode(this.refs.startTime).value !== ""){
            var startDateTime = ReactDOM.findDOMNode(this.refs.startDate).value 
            + "T" + ReactDOM.findDOMNode(this.refs.startTime).value + ":00"; 
        }
        else{
            startDateTime = ReactDOM.findDOMNode(this.refs.startDate).value 
            + "T00:00:00"; 
        }

        if(ReactDOM.findDOMNode(this.refs.endTime).value !== ""){
            var endDateTime = ReactDOM.findDOMNode(this.refs.endDate).value 
            + "T" + ReactDOM.findDOMNode(this.refs.endTime).value + ":00";
        }
        else{
             endDateTime = ReactDOM.findDOMNode(this.refs.endDate).value 
             + "T23:59:59"; 
        }
        
       
        this.setEvent(this.state.token, this.state.code, ReactDOM.findDOMNode(this.refs.location).value
            , ReactDOM.findDOMNode(this.refs.title).value, ReactDOM.findDOMNode(this.refs.description).value
            ,  startDateTime, endDateTime); 

        this.close();
     }

     handleDeleteEvent(){
        this.removeEvent(this.state.token, this.state.code, this.state.idEvent);

        this.closeEvent();

     }

     //alert(event.title + ", " + event.location)

    render(){


    	return (<div>
            <NotificationSystem ref="notificationSystem" style={style}/>
            
		    <BigCalendar
		      events= {this.state.googleEvents}
		      startAccessor='startDate'
		      endAccessor='endDate'
              onSelectEvent={event => this.openEvent(event)} 
		    />

            <Button
              bsStyle="primary"
              className="yellowBtn"
              onClick={this.open}
            >
            <span class="glyphicon glyphicon-plus"></span>
              

            </Button>

            <Modal show={this.state.showModal} onHide={this.close}>
              <Modal.Header closeButton>
                <Modal.Title>Create an event
                <br/> (fields with * are required)
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>

                <Form >

                    <FormGroup controlId="formTitle">
                        <ControlLabel>Title</ControlLabel>{' '}
                        <FormControl type="text" placeholder="My Event" ref="title"/>
                        <FormControl.Feedback />
                    </FormGroup>{' '}

                    <FormGroup controlId="formStartDate">
                        <ControlLabel>Start Date</ControlLabel>{' '}
                        <FormControl type="date" ref="startDate"/>
                        <FormControl.Feedback />
                    </FormGroup>{' '}

                    <FormGroup controlId="formStartTime">
                        <ControlLabel>Start Time</ControlLabel>{' '}
                        <FormControl type="time" ref="startTime"/>
                        <FormControl.Feedback />
                    </FormGroup>{' '}

                    <FormGroup controlId="formEndDate">
                        <ControlLabel>End Date</ControlLabel>{' '}
                        <FormControl type="date" ref="endDate"/>
                        <FormControl.Feedback />
                    </FormGroup>{' '}

                     <FormGroup controlId="formEndTime">
                        <ControlLabel>End Time</ControlLabel>{' '}
                        <FormControl type="time" ref="endTime"/>
                        <FormControl.Feedback />
                    </FormGroup>{' '}

                     <FormGroup controlId="formLocation">
                        <ControlLabel>Location</ControlLabel>{' '}
                        <FormControl type="text" placeholder="My Location" ref="location"/>
                        <FormControl.Feedback />
                    </FormGroup>{' '}

                    <FormGroup controlId="formDescription">
                        <ControlLabel>Description</ControlLabel>{' '}
                        <FormControl type="text" placeholder="My Description" ref="description"/>
                        <FormControl.Feedback />
                    </FormGroup>{' '}

                    <Button bsStyle="primary" className="yellowBtn" onClick={(e) => this.handleSubmit(e)} >Create Event</Button>

                </Form>

              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.close}>Close</Button>
              </Modal.Footer>
            </Modal>


            <Modal show={this.state.showModalEvent} onHide={this.closeEvent}>
              <Modal.Header closeButton>
                <Modal.Title>Summary of the event</Modal.Title>
              </Modal.Header>
              <Modal.Body>

                <Form >

                    <FormGroup controlId="formTitle">
                        <ControlLabel >Title: </ControlLabel>{' '}
                         <ControlLabel >{this.state.titleEvent} </ControlLabel>
                    </FormGroup>{' '}

                    <FormGroup controlId="formStartDate">
                        <ControlLabel>Start Date: </ControlLabel>{' '}
                        <ControlLabel >{this.state.startDateTimeString} </ControlLabel>
                    </FormGroup>{' '}

                    <FormGroup controlId="formEndDate">
                        <ControlLabel>End Date: </ControlLabel>{' '}
                        <ControlLabel >{this.state.endDateTimeString} </ControlLabel>
                    </FormGroup>{' '}

                     <FormGroup controlId="formLocation">
                        <ControlLabel>Location: </ControlLabel>{' '}
                        <ControlLabel >{this.state.locationEvent} </ControlLabel>
                    </FormGroup>{' '}

                    <FormGroup controlId="formDescription">
                        <ControlLabel>Description:</ControlLabel>{' '}
                        <ControlLabel >{this.state.descriptionEvent} </ControlLabel>
                    </FormGroup>{' '}

                    <Button bsStyle="danger" onClick={(e) => this.handleDeleteEvent(e)} >Delete this Event</Button>

                </Form>

              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.closeEvent}>Close</Button>
              </Modal.Footer>
            </Modal>

		  </div>);   	
    }

}

export default Calendar;