package com.pmaj.pm_mobile.activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.design.widget.FloatingActionButton;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.pmaj.pm_mobile.R;

import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Text;

import io.socket.emitter.Emitter;

public class ProfilActivity extends AppCompatActivity {
    private TextView email;
    private TextView name;
    private TextView surname;
    private TextView address;
    private TextView birthday;
    private FloatingActionButton edit_profil;
    private SharedPreferences mPrefs;
    private TextView calendar;
    private TextView family;

    private String addressB;
    private String cp;
    private String city;
    private String country;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profil);
        mPrefs = getSharedPreferences("authToken", 0);

        calendar = (TextView) findViewById(R.id.calendar);
        family = (TextView) findViewById(R.id.family);

        calendar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //Redicrection to Calendar page
                Intent intentLogged = new Intent(ProfilActivity.this, CalendarActivity.class);
                startActivity(intentLogged);
            }
        });

        family.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //Redicrection to Home page
                Intent intentLogged = new Intent(ProfilActivity.this, ChatActivity.class);
                startActivity(intentLogged);
            }
        });


        email = (TextView) findViewById(R.id.email);
        name = (TextView) findViewById(R.id.name);
        surname = (TextView) findViewById(R.id.surname);
        address = (TextView) findViewById(R.id.address);
        birthday = (TextView) findViewById(R.id.birthday);
        edit_profil = (FloatingActionButton) findViewById(R.id.edit_profil);

        LoginActivity.getSocketInstance().getmSocket().on("request_profile_reply", onProfilSuccess);
        LoginActivity.getSocketInstance().getmSocket().on("error", onProfilFail);

        LoginActivity.getSocketInstance().emitGetProfile(mPrefs.getString("token", ""), mPrefs.getString("email", ""));

        edit_profil.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intentEditProfil = new Intent(ProfilActivity.this,EditProfilActivity.class);
                intentEditProfil.putExtra("name",name.getText().toString());
                intentEditProfil.putExtra("surname",surname.getText().toString());
                intentEditProfil.putExtra("address",addressB);
                intentEditProfil.putExtra("cp",cp);
                intentEditProfil.putExtra("city",city);
                intentEditProfil.putExtra("country",country);
                intentEditProfil.putExtra("birthday",birthday.getText().toString());
                startActivity(intentEditProfil);
            }
        });
    }

    private Emitter.Listener onProfilSuccess = new Emitter.Listener() {

        @Override
        public void call(Object... args) {
            final JSONObject obk = (JSONObject) args[0];

            //JSON { 'email': "", 'name': "", 'surname': "", 'address': "", 'cp': "", 'city': "", 'country': "", 'birthday': "" }
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    email.setText(obk.getString("email"));
                    name.setText(obk.getString("name"));
                    surname.setText(obk.getString("surname"));
                    address.setText(obk.getString("address") + " " + obk.getString("cp") + " " + obk.getString("city") + " " + obk.getString("country"));
                    addressB = obk.getString("address");
                    cp = obk.getString("cp");
                    city = obk.getString("city");
                    country = obk.getString("country");
                    birthday.setText(obk.getString("birthday"));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });


            return;
        }
    };

    private Emitter.Listener onProfilFail = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            return;
        }
    };
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
                Intent intent = new Intent(ProfilActivity.this, HomeActivity.class);
                startActivity(intent);
                return true;
            case R.id.icon_profil:
                return true;
            case R.id.log_out :
                SharedPreferences.Editor mEditor = mPrefs.edit();
                mEditor.putLong("lastLogin", 0).apply();
                mEditor.putString("token",null).apply();
                mEditor.putString("name",null).apply();
                mEditor.putString("email",null).apply();
                mEditor.clear().apply();
                mEditor.commit();

                //Redicrection to Login page
                Intent intentLoggedOut = new Intent(ProfilActivity.this, LoginActivity.class);
                startActivity(intentLoggedOut);
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }
}
