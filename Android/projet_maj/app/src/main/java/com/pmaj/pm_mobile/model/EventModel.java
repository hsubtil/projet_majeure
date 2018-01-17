package com.pmaj.pm_mobile.model;

import java.util.Date;

/**
 * Created by pia92 on 16/01/2018.
 */

public class EventModel {
    Long date;
    String summary;

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
