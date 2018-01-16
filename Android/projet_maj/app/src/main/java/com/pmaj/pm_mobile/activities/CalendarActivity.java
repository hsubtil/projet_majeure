package com.pmaj.pm_mobile.activities;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import com.pmaj.pm_mobile.R;

public class CalendarActivity extends AppCompatActivity {

    private TextView calendar;
    private TextView families;
    private TextView map;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_calendar);
        calendar = (TextView) findViewById(R.id.calendar);
        families = (TextView) findViewById(R.id.families);
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

        families.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                //Redicrection to Home page
                Intent intentLogged = new Intent(CalendarActivity.this, HomeActivity.class);
                startActivity(intentLogged);
            }
        });
    }
}
