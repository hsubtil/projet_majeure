package com.pmaj.pm_mobile.activities;

import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.CalendarView;
import android.widget.TextView;
import android.widget.Toast;

import com.github.sundeepk.compactcalendarview.CompactCalendarView;
import com.github.sundeepk.compactcalendarview.domain.Event;
import com.pmaj.pm_mobile.R;
import com.pmaj.pm_mobile.model.EventModel;
import com.pmaj.pm_mobile.tools.EventsAdapter;
import com.pmaj.pm_mobile.tools.FamilyAdapter;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Text;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import io.socket.emitter.Emitter;

public class CalendarActivity extends AppCompatActivity {

    private TextView calendar;
    private TextView family;
    private TextView map;
    private TextView monthYear;
    private RecyclerView recyclerEvents;
    // private CalendarView calendarView;
    CompactCalendarView compactCalendar;
    private SimpleDateFormat dateFormatMonth = new SimpleDateFormat("MMMM-yyyy", Locale.getDefault());
    private SharedPreferences mPrefs;
    private List<EventModel> listEvents = new ArrayList<EventModel>();


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_calendar);

        mPrefs = getSharedPreferences("authToken", 0);
        calendar = (TextView) findViewById(R.id.calendar);
        family = (TextView) findViewById(R.id.family);
        map = (TextView) findViewById(R.id.map);

        calendar.setTextColor(getResources().getColor(R.color.colorPrimaryDark));
        map.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //Redicrection to Map page
                Intent intentLogged = new Intent(CalendarActivity.this, MapActivity.class);
                startActivity(intentLogged);
            }
        });

        family.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                //Redicrection to Home page
                Intent intentLogged = new Intent(CalendarActivity.this, ChatActivity.class);
                startActivity(intentLogged);
            }
        });

        compactCalendar = (CompactCalendarView) findViewById(R.id.compactcalendar_view);
        compactCalendar.setUseThreeLetterAbbreviation(true);

        monthYear = (TextView) findViewById(R.id.monthYear);
        monthYear.setText(dateFormatMonth.format(new Date()));


        LoginActivity.getSocketInstance().getmSocket().on("google_list_events_reply", onGetEventSuccess);
        LoginActivity.getSocketInstance().getmSocket().on("google_list_events_err", onGetEventFail);


        LoginActivity.getSocketInstance().emitGetListEvent(mPrefs.getString("token", ""), mPrefs.getString("family_code", ""));


        compactCalendar.setListener(new CompactCalendarView.CompactCalendarViewListener() {
            @Override
            public void onDayClick(Date dateClicked) {
                Context context = getApplicationContext();
                Long dateSelectedMilliseconds = dateClicked.getTime();
                List<EventModel> listEventsDay = new ArrayList<EventModel>();
                listEventsDay = getListEventsDay(dateClicked);
                if(listEventsDay.isEmpty())
                {
                    final Dialog dialog = new Dialog(CalendarActivity.this);

                    dialog.setContentView(R.layout.pop_up_window_no_events);
                    dialog.setTitle("No Events");
                    dialog.show();
                }

                else
                {
                    final Dialog dialog = new Dialog(CalendarActivity.this);

                    dialog.setContentView(R.layout.pop_up_window_events);

                    recyclerEvents = (RecyclerView) dialog.findViewById(R.id.recyclerEvents);
                    recyclerEvents.setHasFixedSize(true);

                    RecyclerView.LayoutManager mLayoutManager = new LinearLayoutManager(CalendarActivity.this);
                    recyclerEvents.setLayoutManager(mLayoutManager);

                    RecyclerView.Adapter myAdapter = new EventsAdapter(listEventsDay, CalendarActivity.this);
                    recyclerEvents.setAdapter(myAdapter);
                    dialog.setTitle("Events");
                    dialog.show();
                }

            }

            @Override
            public void onMonthScroll(Date firstDayOfNewMonth) {
                monthYear.setText(dateFormatMonth.format(firstDayOfNewMonth));
            }
        });


    }

    private Emitter.Listener onGetEventSuccess = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            JSONArray eventsArray = (JSONArray) args[0];
            Long dateLong = null;
            try {
                for (int i = 0; i < eventsArray.length(); i++) {
                    JSONObject event = (JSONObject) eventsArray.getJSONObject(i);
                    JSONObject start = (JSONObject) event.getJSONObject("start");
                    boolean tP = start.has("dateTime");
                    EventModel e = new EventModel();
                    if (start.has("dateTime") && event.has("summary")) {
                        e.setDate(convertDateStringToLong(start.getString("dateTime"),"yyyy-MM-dd'T'HH:mm:ss'Z'"));
                        e.setSummary(event.getString("summary"));

                    } else {
                        if (start.has("date") && event.has("summary") ) {
                            dateLong = convertDateStringToLong(start.getString("date"),"yyyy-MM-dd");
                            e.setSummary(event.getString("summary"));
                            e.setDate(dateLong);
                        }
                    }
                    if (e != null)
                        listEvents.add(e);
                }
                displayEvents();
            } catch (JSONException e) {
                e.printStackTrace();
            }

            return;
        }
    };

    private Emitter.Listener onGetEventFail = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            return;
        }
    };

    private void displayEvents() {
        for (EventModel e : listEvents) {
            Long dateLong = e.getDate();
            String eSummary = e.getSummary();
            final Event ev = new Event(Color.RED, dateLong, eSummary);
            compactCalendar.addEvent(ev, false);
        }

        return;
    }

    private Long convertDateStringToLong(String dateString, String format) {
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        Date date = null;
        Long longDate = null;
        try {
            date = sdf.parse(dateString);
            longDate = date.getTime();
            return longDate;
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }
    }

    private String convertDateToString(Date date, String format){

        SimpleDateFormat df = new SimpleDateFormat(format);
        String stringDate = df.format(date);

        return stringDate;
    }

    private List<EventModel> getListEventsDay(Date date){
        List<EventModel> listEventsDay = new ArrayList<EventModel>();
        String format = "yyyy-MM-dd";
        String stringDate = convertDateToString(date,format);
        Long actualDay = convertDateStringToLong(stringDate,format);
        Long dayBefore = actualDay - 86400000L;
        Long dayAfter = actualDay + 86400000L;

        for(EventModel e : listEvents){
            if(e.getDate()<dayAfter && e.getDate()>dayBefore)
                listEventsDay.add(e);
        }

        return listEventsDay;
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);//Menu Resource, Menu
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.families:
                //Redicrection to Profile page
                Intent intent = new Intent(CalendarActivity.this, HomeActivity.class);
                startActivity(intent);
                return true;
            case R.id.icon_profil:
                //Redicrection to Profile page
                Intent intentLogged = new Intent(CalendarActivity.this, ProfilActivity.class);
                startActivity(intentLogged);
                return true;
            case R.id.log_out:
                SharedPreferences.Editor mEditor = mPrefs.edit();
                mEditor.putLong("lastLogin", 0).apply();
                mEditor.putString("token", null).apply();
                mEditor.putString("name", null).apply();
                mEditor.putString("email", null).apply();
                //mEditor.clear().apply();
                mEditor.commit();

                //Redicrection to Login page
                Intent intentLoggedOut = new Intent(CalendarActivity.this, LoginActivity.class);
                startActivity(intentLoggedOut);
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }
}
