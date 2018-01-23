package com.pmaj.pm_mobile.activities;

import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Build;
import android.support.annotation.RequiresApi;
import android.support.design.widget.FloatingActionButton;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.TimePicker;

import com.github.sundeepk.compactcalendarview.CompactCalendarView;
import com.github.sundeepk.compactcalendarview.domain.Event;
import com.pmaj.pm_mobile.R;
import com.pmaj.pm_mobile.model.EventModel;
import com.pmaj.pm_mobile.tools.EventsAdapter;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import io.socket.emitter.Emitter;

public class CalendarActivity extends AppCompatActivity {

    private TextView calendar;
    private TextView family;
    private TextView monthYear;
    private TextView title;
    private RecyclerView recyclerEvents;
    private FloatingActionButton btnAddEvent;
    private static CompactCalendarView compactCalendar;
    private SimpleDateFormat dateFormatMonth = new SimpleDateFormat("MMMM-yyyy", Locale.getDefault());
    private static SharedPreferences mPrefs;
    private static List<EventModel> listEvents = new ArrayList<EventModel>();
    private Date dateSelected;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_calendar);

        mPrefs = getSharedPreferences("authToken", 0);
        calendar = (TextView) findViewById(R.id.calendar);
        family = (TextView) findViewById(R.id.family);
        btnAddEvent = (FloatingActionButton) findViewById(R.id.btnAddEvent);
        title = (TextView) findViewById(R.id.title);


        calendar.setTextColor(getResources().getColor(R.color.colorPrimaryDark));

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
        LoginActivity.getSocketInstance().getmSocket().on("google_set_event_reply", onSetEventSuccess);
        LoginActivity.getSocketInstance().getmSocket().on("google_set_event_err", onSetEventFail);


        LoginActivity.getSocketInstance().emitGetListEvent(mPrefs.getString("token", ""), mPrefs.getString("family_code", ""));


        compactCalendar.setListener(new CompactCalendarView.CompactCalendarViewListener() {
            @Override
            public void onDayClick(Date dateClicked) {

                title.setText("Events of : " + convertDateToString(dateClicked, "dd-MM-YYYY"));
                List<EventModel> listEventsDay = new ArrayList<EventModel>();
                listEventsDay = getListEventsDay(dateClicked);
                dateSelected = dateClicked;


                recyclerEvents = (RecyclerView) findViewById(R.id.recyclerEvents);
                recyclerEvents.setHasFixedSize(true);

                RecyclerView.LayoutManager mLayoutManager = new LinearLayoutManager(CalendarActivity.this);
                recyclerEvents.setLayoutManager(mLayoutManager);

                RecyclerView.Adapter myAdapter = new EventsAdapter(listEventsDay, CalendarActivity.this);
                recyclerEvents.setAdapter(myAdapter);
            }

            @Override
            public void onMonthScroll(Date firstDayOfNewMonth) {
                monthYear.setText(dateFormatMonth.format(firstDayOfNewMonth));

            }
        });

        btnAddEvent.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                final Dialog dialog = new Dialog(CalendarActivity.this);

                dialog.setContentView(R.layout.pop_up_window_add_event);
                dialog.setTitle("Add Event");
                dialog.show();

                Button btnNext = (Button) dialog.findViewById(R.id.btnNext);

                btnNext.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {

                        EditText eventTitle = (EditText) dialog.findViewById(R.id.eventTitle);
                        final String summary = eventTitle.getText().toString();

                        DatePicker simpleDatePicker = (DatePicker) dialog.findViewById(R.id.simpleDatePicker);
                        final int day = simpleDatePicker.getDayOfMonth();
                        final int month = simpleDatePicker.getMonth();
                        final int year = simpleDatePicker.getYear();


                        dialog.setContentView(R.layout.pop_up_window_add_hour_event);
                        dialog.setTitle("Add Time Event");
                        dialog.show();

                        Button btnCreate = (Button) dialog.findViewById(R.id.btnCreate);

                        btnCreate.setOnClickListener(new View.OnClickListener() {
                            @RequiresApi(api = Build.VERSION_CODES.M)
                            @Override
                            public void onClick(View v) {
                                TimePicker simpleTimePicker = (TimePicker) dialog.findViewById(R.id.simpleTimePicker);
                                int hour = simpleTimePicker.getHour();
                                int min = simpleTimePicker.getMinute();
                                String format = "yyyy-MM-dd'T'HH:mm:ss'Z'";
                                SimpleDateFormat df = new SimpleDateFormat(format);

                                Calendar calStart = Calendar.getInstance();
                                calStart.set(year, month, day, hour, min);
                                String dateStart = df.format(calStart.getTime());

                                Calendar calEnd = Calendar.getInstance();
                                calEnd.set(year, month, day, hour + 1, min);
                                String dateEnd = df.format(calEnd.getTime());


                                JSONObject event = new JSONObject();
                                JSONObject start = new JSONObject();
                                JSONObject end = new JSONObject();
                                try {
                                    start.put("dateTime", dateStart);
                                    end.put("dateTime", dateEnd);
                                    event.put("summary", summary);
                                    event.put("start", start);
                                    event.put("end", end);

                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }

                                LoginActivity.getSocketInstance().emitCreateEvent(mPrefs.getString("token", ""), mPrefs.getString("family_code", ""), event);
                                dialog.dismiss();

                            }
                        });
                    }
                });
            }
        });


    }

    private Emitter.Listener onGetEventSuccess = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            JSONArray eventsArray = (JSONArray) args[0];
            try {
                if (eventsArray != null) {
                    for (int i = 0; i < eventsArray.length(); i++) {
                        JSONObject event = (JSONObject) eventsArray.getJSONObject(i);
                        JSONObject start = (JSONObject) event.getJSONObject("start");
                        EventModel e = new EventModel();
                        if (start.has("dateTime") && event.has("summary") && event.has("id")) {
                            e.setDate(convertDateStringToLong(start.getString("dateTime"), "yyyy-MM-dd'T'HH:mm:ss'Z'"));
                            e.setSummary(event.getString("summary"));
                            e.setEventId(event.getString("id"));

                        } else {
                            if (start.has("date") && event.has("summary") && event.has("id")) {
                                e.setSummary(event.getString("summary"));
                                e.setDate(convertDateStringToLong(start.getString("date"), "yyyy-MM-dd"));
                                e.setEventId(event.getString("id"));
                            }
                        }
                        if (e != null) {
                            if (!eventAlreadyExists(e)) {
                                listEvents.add(e);

                                final Event ev = new Event(Color.RED, e.getDate(), e.getSummary());
                                compactCalendar.addEvent(ev, false);
                            }
                        }
                    }
                }
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

    private Emitter.Listener onSetEventSuccess = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            JSONObject event = (JSONObject) args[0];
            JSONObject start = null;

            try {
                start = (JSONObject) event.getJSONObject("start");
                EventModel e = new EventModel();
                if (start.has("dateTime") && event.has("summary") && event.has("id")) {
                    e.setDate(convertDateStringToLong(start.getString("dateTime"), "yyyy-MM-dd'T'HH:mm:ss'Z'"));
                    e.setSummary(event.getString("summary"));
                    e.setEventId(event.getString("id"));

                } else {
                    if (start.has("date") && event.has("summary") && event.has("id")) {
                        e.setSummary(event.getString("summary"));
                        e.setDate(convertDateStringToLong(start.getString("date"), "yyyy-MM-dd"));
                        e.setEventId(event.getString("id"));
                    }
                }
                if (e != null && !eventAlreadyExists(e)) {
                    listEvents.add(e);

                    final Event ev = new Event(Color.RED, e.getDate(), e.getSummary());
                    compactCalendar.addEvent(ev, false);

                }
            } catch (JSONException e) {
                e.printStackTrace();
            }

            // PopupWindow popUpMessage = new PopupWindow(CalendarActivity.this);
            //View popUpView = (View) findViewById(R.id.title_calendar);
            //popUpMessage.setContentView(popUpView);
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    final Dialog dialog = new Dialog(CalendarActivity.this);
                    dialog.setContentView(R.layout.pop_up_window_event_status);
                    TextView status = (TextView) dialog.findViewById(R.id.title);
                    status.setText("Your Event has been added !");
                    dialog.show();
                    //dialog.dismiss();
                }
            });


            return;
        }
    };

    private Emitter.Listener onSetEventFail = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    final Dialog dialog = new Dialog(CalendarActivity.this);
                    dialog.setContentView(R.layout.pop_up_window_event_status);
                    TextView status = (TextView) dialog.findViewById(R.id.title);
                    status.setText("Ouuuups there was a problem.Please Try again !");

                    dialog.show();
                }
            });

            return;
        }
    };

    private boolean eventAlreadyExists(EventModel e) {
        for (EventModel event : listEvents) {
            if (event.getEventId().equals(e.getEventId()))
                return true;
        }
        return false;
    }


   /* private void displayEvents() {
        for (EventModel e : listEvents) {
            Long dateLong = e.getDate();
            String eSummary = e.getSummary();
            final Event ev = new Event(Color.RED, dateLong, eSummary);
            compactCalendar.addEvent(ev, false);
        }

        return;
    }*/

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

    private String convertDateToString(Date date, String format) {

        SimpleDateFormat df = new SimpleDateFormat(format);
        String stringDate = df.format(date);

        return stringDate;
    }

    private Date convertLongToDate(Long date, String format) {

        SimpleDateFormat formatter = new SimpleDateFormat(format);

        // Create a calendar object that will convert the date and time value in milliseconds to date.
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(date);
        Date convertedDate = new Date();
        try {
            convertedDate = formatter.parse(format);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return convertedDate;
    }

    private List<EventModel> getListEventsDay(Date date) {
        List<EventModel> listEventsDay = new ArrayList<EventModel>();
        String format = "yyyy-MM-dd";
        String stringDate = convertDateToString(date, format);
        Long actualDay = convertDateStringToLong(stringDate, format);
        Long dayAfter = actualDay + 86400000L;

        for (EventModel e : listEvents) {
            if (e.getDate() >= actualDay && e.getDate() < dayAfter)
                listEventsDay.add(e);
        }

        return listEventsDay;
    }

    public static List<EventModel> getlistEvents() {
        return listEvents;
    }

    public static CompactCalendarView getCalendar() {
        return compactCalendar;
    }

    public void deleteEventSuccess(EventModel eventRemoved) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                final Dialog dialog = new Dialog(CalendarActivity.this);

                dialog.setContentView(R.layout.pop_up_window_event_status);
                TextView status = (TextView) dialog.findViewById(R.id.title);
                status.setText("Your Event has been removed !");
                dialog.show();
            }
        });
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
                mEditor.clear().apply();
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
