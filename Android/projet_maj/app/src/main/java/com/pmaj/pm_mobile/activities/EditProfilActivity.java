package com.pmaj.pm_mobile.activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.pmaj.pm_mobile.R;

public class EditProfilActivity extends AppCompatActivity {
    private SharedPreferences mPrefs;
    private TextView calendar;
    private TextView family;
    private TextView map;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_edit_profil);
        mPrefs = getSharedPreferences("authToken", 0);

        calendar = (TextView) findViewById(R.id.calendar);
        family = (TextView) findViewById(R.id.family);
        map = (TextView) findViewById(R.id.map);

        calendar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //Redicrection to Calendar page
                Intent intentLogged = new Intent(EditProfilActivity.this, CalendarActivity.class);
                startActivity(intentLogged);
            }
        });

        map.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //Redicrection to Map page
                Intent intentLogged = new Intent(EditProfilActivity.this, MapActivity.class);
                startActivity(intentLogged);
            }
        });

        family.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                //Redicrection to Home page
                Intent intentLogged = new Intent(EditProfilActivity.this, ChatActivity.class);
                startActivity(intentLogged);
            }
        });

        //JSON { 'email': "", 'name': "", 'surname': "", 'address': "", 'cp': "", 'city':"", 'country': "", 'birthday': "" }

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
            Intent intent = new Intent(EditProfilActivity.this, HomeActivity.class);
            startActivity(intent);
            return true;
            case R.id.icon_profil:

                //Redicrection to Profile page
                Intent intentLogged = new Intent(EditProfilActivity.this, ProfilActivity.class);
                startActivity(intentLogged);                return true;
            case R.id.log_out :
                SharedPreferences.Editor mEditor = mPrefs.edit();
                mEditor.putLong("lastLogin", 0).apply();
                mEditor.putString("token",null).apply();
                mEditor.putString("name",null).apply();
                mEditor.putString("email",null).apply();
                mEditor.clear().apply();
                mEditor.commit();

                //Redicrection to Login page
                Intent intentLoggedOut = new Intent(EditProfilActivity.this, LoginActivity.class);
                startActivity(intentLoggedOut);
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }
}
