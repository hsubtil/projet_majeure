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
import com.pmaj.pm_mobile.model.Profile;

import org.json.JSONException;
import org.json.JSONObject;

import io.socket.emitter.Emitter;

public class EditProfilActivity extends AppCompatActivity {
    private SharedPreferences mPrefs;
    private TextView calendar;
    private TextView family;

    private EditText name;
    private EditText surname;
    private EditText address;
    private EditText cp;
    private EditText city;
    private EditText country;
    private EditText birthday;
    private Button editProfil;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_edit_profil);
        mPrefs = getSharedPreferences("authToken", 0);

        calendar = (TextView) findViewById(R.id.calendar);
        family = (TextView) findViewById(R.id.family);
        editProfil = (Button) findViewById(R.id.editProfil);

        name = (EditText) findViewById(R.id.name);
        surname = (EditText) findViewById(R.id.surname);
        address = (EditText) findViewById(R.id.address);
        cp = (EditText) findViewById(R.id.cp);
        city = (EditText) findViewById(R.id.city);
        country = (EditText) findViewById(R.id.country);
        birthday = (EditText) findViewById(R.id.birthday);

        name.setText(getIntent().getStringExtra("name"));
        surname.setText(getIntent().getStringExtra("surname"));
        address.setText(getIntent().getStringExtra("address"));
        cp.setText(getIntent().getStringExtra("cp"));
        city.setText(getIntent().getStringExtra("city"));
        country.setText(getIntent().getStringExtra("country"));
        birthday.setText(getIntent().getStringExtra("birthday"));

        LoginActivity.getSocketInstance().getmSocket().on("update_user_profil_success",onUpdateUserSuccess);
        LoginActivity.getSocketInstance().getmSocket().on("error",onError);


        calendar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //Redicrection to Calendar page
                Intent intentLogged = new Intent(EditProfilActivity.this, CalendarActivity.class);
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

        editProfil.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                JSONObject p = new JSONObject();
                try {
                    p.put("name",name.getText().toString());
                    p.put("surname",surname.getText().toString());
                    p.put("address",address.getText().toString());
                    p.put("cp",cp.getText().toString());
                    p.put("city",city.getText().toString());
                    p.put("country",country.getText().toString());
                    p.put("birthday",birthday.getText().toString());
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                LoginActivity.getSocketInstance().emitEditProfile(mPrefs.getString("token",""),mPrefs.getString("email",""),p);
            }
        });

        //JSON { 'email': "", 'name': "", 'surname': "", 'address': "", 'cp': "", 'city':"", 'country': "", 'birthday': "" }

    }

    private Emitter.Listener onUpdateUserSuccess = new Emitter.Listener() {

        @Override
        public void call(Object... args) {
            final JSONObject obk = (JSONObject) args[0];
            SharedPreferences.Editor mEditor = mPrefs.edit();
            mEditor.putString("name",name.getText().toString()).apply();
            mEditor.commit();
            //Redicrection to Profile page
            Intent intent = new Intent(EditProfilActivity.this, ProfilActivity.class);
            startActivity(intent);

            return;
        }
    };

    private Emitter.Listener onError = new Emitter.Listener() {

        @Override
        public void call(Object... args) {
            final JSONObject obk = (JSONObject) args[0];

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
