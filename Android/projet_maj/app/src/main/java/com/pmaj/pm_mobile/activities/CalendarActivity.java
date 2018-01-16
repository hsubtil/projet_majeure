package com.pmaj.pm_mobile.activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.pmaj.pm_mobile.R;
import com.pmaj.pm_mobile.model.Event;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import io.socket.emitter.Emitter;

public class CalendarActivity extends AppCompatActivity {

    private TextView calendar;
    private TextView family;
    private TextView map;
    private SharedPreferences mPrefs;
    private List<Event> listEvents = new ArrayList<Event>();


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

        LoginActivity.getSocketInstance().getmSocket().on("google_list_events_reply", onGetEventSuccess);
        LoginActivity.getSocketInstance().getmSocket().on("google_list_events_err", onGetEventFail);


        LoginActivity.getSocketInstance().emitGetListEvent(mPrefs.getString("token", ""), mPrefs.getString("family_code", ""));
    }

    private Emitter.Listener onGetEventSuccess = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            JSONArray eventsArray = (JSONArray) args[0];

            try {
                //TODO mettre protection si pas de dateTime checker for date si aucun pas d'évé 
                for (int i = 0; i < eventsArray.length(); i++) {
                    JSONObject event = (JSONObject) eventsArray.getJSONObject(i);
                    JSONObject start = (JSONObject) event.getJSONObject("start");
                    Event e = new Event();
                    e.setDate(start.getString("dateTime"));
                    e.setSummary(event.getString("summary"));
                    listEvents.add(e);
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }

            displayEvents();
            return;
        }
    };

    private Emitter.Listener onGetEventFail = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            return;
        }
    };

    private void displayEvents (){
        //TODO METHODE

        return;
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
            case R.id.families :
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
