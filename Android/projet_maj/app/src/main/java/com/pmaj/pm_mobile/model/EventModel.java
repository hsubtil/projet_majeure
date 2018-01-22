package com.pmaj.pm_mobile.model;

import java.util.Date;

/**
 * Created by pia92 on 16/01/2018.
 */

public class EventModel {
    String eventId;
    Long date;
    String summary;

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public Long getDate() {
        return date;
    }

    public void setDate(Long date) {
        this.date = date;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }
}
