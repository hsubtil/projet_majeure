package com.pmaj.pm_mobile.activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;

import com.pmaj.pm_mobile.R;
import com.pmaj.pm_mobile.tools.NetworkCom;

import org.json.JSONException;
import org.json.JSONObject;

import io.socket.emitter.Emitter;

public class NavBarActivity extends AppCompatActivity {


    private Button log_out;
    private ImageView icon_profil;

    private SharedPreferences mPrefs;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mPrefs = getSharedPreferences("authToken", 0);


        log_out = (Button) findViewById(R.id.log_out);
        icon_profil = (ImageView) findViewById(R.id.icon_profil);

        LoginActivity.getSocketInstance().getmSocket().on("request_profile_reply", onProfilSuccess);
        LoginActivity.getSocketInstance().getmSocket().on("error", onProfilFail);


        log_out.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                SharedPreferences.Editor mEditor = mPrefs.edit();
                mEditor.putLong("lastLogin", 0).apply();
                mEditor.putString("token",null).apply();
                mEditor.putString("name",null).apply();
                mEditor.putString("email",null).apply();
                mEditor.commit();

                //Redicrection to Login page
                Intent intentLogged = new Intent(NavBarActivity.this, LoginActivity.class);
                startActivity(intentLogged);


            }
        });

        icon_profil.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                LoginActivity.getSocketInstance().emitGetProfile(mPrefs.getString("token",""), mPrefs.getString("email",""));
            }
        });

    }

    private Emitter.Listener onProfilSuccess = new Emitter.Listener() {

        @Override
        public void call(Object... args) {
            JSONObject obk = (JSONObject) args[0];

            //JSON { 'email': "", 'name': "", 'surname': "", 'address': "", 'cp': "", 'city': "", 'country': "", 'birthday': "" }

            String email = "";
            String name = "";
            String surname = "";
            String address = "";
            String cp = "";
            String city = "";
            String country = "";
            String birthday = "";
            try {
                email = obk.getString("email");
                name = obk.getString("name");
                surname = obk.getString("surname");
                address = obk.getString("address") + " " + obk.getString("cp") + " " + obk.getString("city") + " " + obk.getString("country");
                birthday = obk.getString("birthday");
            } catch (JSONException e) {
                e.printStackTrace();
            }

            //Redicrection to Profile page
            Intent intentLogged = new Intent(NavBarActivity.this, ProfilActivity.class);
            intentLogged.putExtra("name", name);
            intentLogged.putExtra("email", email);
            intentLogged.putExtra("surname", surname);
            intentLogged.putExtra("address", address);
            intentLogged.putExtra("birthday", birthday);

            startActivity(intentLogged);

            return;
        }
    };

    private Emitter.Listener onProfilFail = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            return;
        }
    };



}
