import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import socketIOClient from 'socket.io-client';

var request_url = "http://192.168.1.100:1337";

class Calendar extends React.Component {
    constructor(props) {
        super(props);

        console.log(props);

		this.socket = props.socket;
		this.events = [];

        var self = this;

        BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
        var myDate = moment().format();
        console.log("myDate");
        console.log(myDate);

        var myDate2 = new Date();
        console.log("myDate2");
        console.log(myDate2);


        this.socket.on('google_list_events_reply', function (data){

            console.log('google_list_events_reply');
            console.log(data);
            self.events = [];        
            Object.keys(data).forEach(function(key) {
                var val = data[key];
                var end = val['end']['dateTime'];
                var start = val['start']['dateTime'];
                var summary = val['summary'];
                var location = val['location'];
                //start = start.substring(0,start.length-1);
                //end = end.substring(0,end.length-1);
				console.log("summary: " + summary + ",start: " + start + ",end: " + end);
				console.log(start);
				start = new Date(start);
				end = new Date(end);
				console.log(start);
				console.log(typeof start);
                self.setState({
                    events: self.events.push({
                    	title: summary,
	                    startDate: start,
	                    endDate: end,
	                    location: location,
	                    
                    })
                });
            });   
        });

        this.socket.on('google_list_events_err', function (data){

            console.log('google_list_events_err');
            alert("Error while retrieving the events, please reload the page !");
  
        });

        this.socket.on('google_set_event_err', function (data){

            console.log('google_set_event_err');
            alert("Error while the event, please try again !");
  
        });

        this.socket.on('google_set_event_reply', function (data){

            console.log('google_set_event_reply');
            alert("Event successfully created!");
  
        });


        this.setEvent = this.setEvent.bind(this); 
        this.getListEvents = this.getListEvents.bind(this); 
        this.getListEvents();
       // this.setEvent("Alpes", "Ski", "fondue au programme",  new Date(2018, 0, 1), new Date(2018, 0, 3)); 
    }

    setEvent(location, summary, description, start_dateTime, end_DateTime) {
        console.log("setEvent");
 		console.log("location: " + location + ", summary: " + summary + ", description: " + description 
 			+ ", start_dateTime: " + start_dateTime + ", end_DateTime: " + end_DateTime );
        this.socket.emit('google_set_event', {
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTNiY2FhYTExYmE5MTAwNWFlMTZhMzkiLCJlbWFpbCI6Im5hYmlsLmZla2lyQG9sLmNvbSIsIm5hbWUiOiJuYWJpbCIsInN1cm5hbWUiOiJmZWtpciIsImFkZHJlc3MiOiJBdmVudWUgZHUgc3RhZGUiLCJjcCI6IjY5MTEwIiwiY2l0eSI6IkRlY2luZXMiLCJjb3VudHJ5IjoiRnJhbmNlIiwiYmlydGhkYXkiOiIxOS0xMi0xOTkzIiwiaWF0IjoxNTE0MzkyODI4fQ.p3mOK9yNA4kwukTSKHP5bGnw2joUFQj_DhkefSRp3PI"
                , 'code': "a9e5-55e4-1c2f-463b"
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
        this.getListEvents();
    }

    getListEvents() {
        console.log("getListEvents");
 
        this.socket.emit('google_list_events', {
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTNiY2FhYTExYmE5MTAwNWFlMTZhMzkiLCJlbWFpbCI6Im5hYmlsLmZla2lyQG9sLmNvbSIsIm5hbWUiOiJuYWJpbCIsInN1cm5hbWUiOiJmZWtpciIsImFkZHJlc3MiOiJBdmVudWUgZHUgc3RhZGUiLCJjcCI6IjY5MTEwIiwiY2l0eSI6IkRlY2luZXMiLCJjb3VudHJ5IjoiRnJhbmNlIiwiYmlydGhkYXkiOiIxOS0xMi0xOTkzIiwiaWF0IjoxNTE0MzkyODI4fQ.p3mOK9yNA4kwukTSKHP5bGnw2joUFQj_DhkefSRp3PI"
                , 'code': "a9e5-55e4-1c2f-463b"
            }) 
    }


    


    render(){

    	return (<div>
		    <BigCalendar
		      events= {this.events}
		      startAccessor='startDate'
		      endAccessor='endDate'
		    />
		  </div>);   	
    }

}

export default Calendar;