package com.pmaj.pm_mobile.activities;

import android.content.Intent;
import android.content.SharedPreferences;
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

import org.w3c.dom.Text;

public class ProfilActivity extends AppCompatActivity {
    private TextView email;
    private TextView name;
    private TextView surname;
    private TextView address;
    private TextView birthday;
    private Button edit_profil;
    private SharedPreferences mPrefs;
    private TextView calendar;
    private TextView families;
    private TextView map;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profil);

        calendar = (TextView) findViewById(R.id.calendar);
        families = (TextView) findViewById(R.id.families);
        map = (TextView) findViewById(R.id.map);

        calendar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //Redicrection to Calendar page
                Intent intentLogged = new Intent(ProfilActivity.this, CalendarActivity.class);
                startActivity(intentLogged);
            }
        });

        map.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //Redicrection to Map page
                Intent intentLogged = new Intent(ProfilActivity.this, MapActivity.class);
                startActivity(intentLogged);
            }
        });

        families.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                //Redicrection to Home page
                Intent intentLogged = new Intent(ProfilActivity.this, HomeActivity.class);
                startActivity(intentLogged);
            }
        });
        mPrefs = getSharedPreferences("authToken", 0);


        email = (TextView) findViewById(R.id.email);
        name = (TextView) findViewById(R.id.name);
        surname = (TextView) findViewById(R.id.surname);
        address = (TextView) findViewById(R.id.address);
        birthday = (TextView) findViewById(R.id.birthday);
        edit_profil = (Button) findViewById(R.id.edit_profil);

        email.setText(getIntent().getStringExtra("email"));
        name.setText(getIntent().getStringExtra("name"));
        surname.setText(getIntent().getStringExtra("surname"));
        address.setText(getIntent().getStringExtra("address"));
        birthday.setText(getIntent().getStringExtra("birthday"));

        edit_profil.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intentEditProfil = new Intent(ProfilActivity.this,EditProfilActivity.class);
                startActivity(intentEditProfil);
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
            case R.id.icon_profil:
                LoginActivity.getSocketInstance().emitGetProfile(mPrefs.getString("token",""), mPrefs.getString("email",""));
                return true;
            case R.id.log_out :
                SharedPreferences.Editor mEditor = mPrefs.edit();
                mEditor.putLong("lastLogin", 0).apply();
                mEditor.putString("token",null).apply();
                mEditor.putString("name",null).apply();
                mEditor.putString("email",null).apply();
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
