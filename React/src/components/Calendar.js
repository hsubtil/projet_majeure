import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
    }


    render(){

    	return (<div>
		    <BigCalendar
		      events= {[]}
		      startAccessor='startDate'
		      endAccessor='endDate'
		    />
		  </div>);   	
    }

}

export default Calendar;