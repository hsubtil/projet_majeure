import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import "../../node_modules/react-big-calendar/lib/css/react-big-calendar.css";

class Calendar extends React.Component {
    constructor(props) {
        super(props);

        console.log(props);
        this.state = {
        	googleEvents: [],
            user: localStorage.getItem("user"),
            code: localStorage.getItem("selectedgroup_code"),
            token: localStorage.getItem("token")
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
            alert("Error while retrieving the events, please reload the page !");
  
        });

        this.socket.on('google_set_event_err', function (data){
            console.log('google_set_event_err');
            alert("Error while the event, please reload the page !");
  
        });

        this.socket.on('google_set_event_reply', function (data){
            console.log('google_set_event_reply');
            alert("Event successfully created!");
  
        });

        this.setEvent = this.setEvent.bind(this); 
        this.getListEvents = this.getListEvents.bind(this); 
        this.getListEvents(this.state.token, this.state.code);
       // this.setEvent(this.state.token, this.state.code, "Alpes", "Ski", "fondue au programme",  new Date(2018, 0, 1), new Date(2018, 0, 3)); 
    }

    displayEvents(data, obj){
    	obj.googleEvents = []; 

        Object.keys(data).forEach(function(key) {
            var val = data[key];
            var end = val['end']['dateTime'];
            var start = val['start']['dateTime'];
            var summary = val['summary'];
            var location = val['location'];

			console.log("summary: " + summary + ",start: " + start + ",end: " + end);
			start = new Date(start);
			end = new Date(end);

            obj.setState({
                events: obj.state.googleEvents.push({
                    title: summary,
	                startDate: start,
	                endDate: end,
	                location: location,	                    
                })
            });
        }); 
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

    render(){


    	return (<div>
		    <BigCalendar
		      events= {this.state.googleEvents}
		      startAccessor='startDate'
		      endAccessor='endDate'
		    />
		  </div>);   	
    }

}

export default Calendar;