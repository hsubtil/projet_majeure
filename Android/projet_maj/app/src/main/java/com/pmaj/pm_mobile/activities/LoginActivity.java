package com.pmaj.pm_mobile.activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.pmaj.pm_mobile.R;
import com.pmaj.pm_mobile.tools.Helper;
import com.pmaj.pm_mobile.tools.NetworkCom;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Date;

import io.socket.emitter.Emitter;

public class LoginActivity extends AppCompatActivity {
    private EditText email;
    private EditText password;
    private Button signUp;
    private Button connect;
    private ProgressBar progressBar;
    private NetworkCom socket;
    private SharedPreferences mPrefs;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        email = (EditText) findViewById(R.id.email);
        password = (EditText) findViewById(R.id.password);
        signUp = (Button) findViewById(R.id.signUp);
        connect = (Button) findViewById(R.id.connect);
        progressBar = (ProgressBar) findViewById(R.id.progressBar);

        mPrefs = getSharedPreferences("authToken", 0);
        mPrefs = getSharedPreferences("name",0);

        //Socket
        socket = new NetworkCom();
        socket.getmSocket().on("auth_success", onAuthSuccess);
        socket.getmSocket().on("auth_failed", onAuthFail);


        //TODO JUSTE POUR TESTER LA REDIRECTION DE PAGE ET LES AUTRES PAGES
        //Redicrection to Home page
        SharedPreferences.Editor TempEditor = mPrefs.edit();
        // Shared preference declaration
        TempEditor.putString("authToken", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTNiY2FhYTExYmE5MTAwNWFlMTZhMzkiLCJlbWFpbCI6Im5hYmlsLmZla2lyQG9sLmNvbSIsIm5hbWUiOiJuYWJpbCIsInN1cm5hbWUiOiJmZWtpciIsImFkZHJlc3MiOiJBdmVudWUgZHUgc3RhZGUiLCJjcCI6IjY5MTEwIiwiY2l0eSI6IkRlY2luZXMiLCJjb3VudHJ5IjoiRnJhbmNlIiwiYmlydGhkYXkiOiIxOS0xMi0xOTkzIiwiaWF0IjoxNTE0MzkyODI4fQ.p3mOK9yNA4kwukTSKHP5bGnw2joUFQj_DhkefSRp3PI").apply();
        TempEditor.putString("name","Nabil").apply();

        Intent intentLogged = new Intent(LoginActivity.this, HomeActivity.class);
        intentLogged.putExtra("email","test.fekir@ol.com");
        startActivity(intentLogged);

        checkConnectionToken();


        connect.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                progressBar.setVisibility(View.VISIBLE);
                SharedPreferences.Editor mEditor = mPrefs.edit();
                mEditor.putLong("lastLogin", new Date().getTime());                 // Add a time to check timeout
                mEditor.putString("authLogin", email.getText().toString());     // Add Login
                mEditor.commit();
                socket.emitConnect(email.getText().toString(), password.getText().toString());
                Toast.makeText(LoginActivity.this, "Login Attempt", Toast.LENGTH_LONG).show();

                progressBar.setVisibility(View.INVISIBLE);
            }
        });

        signUp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intentSignUp = new Intent(LoginActivity.this, SignUpActivity.class);
                startActivity(intentSignUp);
            }
        });
    }

    private Emitter.Listener onAuthSuccess = new Emitter.Listener() {

        @Override
        public void call(Object... args) {
            JSONObject obk = (JSONObject) args[0];

            String token = "";
            String name ="";
            try {
                token = obk.getString("token");
                name = obk.getString("name");
            } catch (JSONException e) {
                e.printStackTrace();
            }

            SharedPreferences.Editor mEditor = mPrefs.edit();
            // Shared preference declaration
            mEditor.putString("authToken", token).apply();
            mEditor.putString("name",name).apply();

            //Redicrection to Home page
            Intent intentLogged = new Intent(LoginActivity.this, HomeActivity.class);
            intentLogged.putExtra("email",email.getText().toString());
            startActivity(intentLogged);

            return;
        }
    };

    private Emitter.Listener onAuthFail = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            return;
        }
    };

    private void checkConnectionToken() {
        Long lastLogin = mPrefs.getLong("lastLogin", 36);
        long acutallogin = new Date().getTime();
        if (lastLogin != 0 && (acutallogin - lastLogin) < 3000) {
            Toast.makeText(LoginActivity.this, "Hello again !", Toast.LENGTH_LONG).show();
           //Redirection vers Page Home
            Intent intentLogged = new Intent(LoginActivity.this, HomeActivity.class);
           startActivity(intentLogged);
        } else {
            Toast.makeText(LoginActivity.this, "Logged out", Toast.LENGTH_LONG).show();
        }

    }


    @Override
    protected void onDestroy() {
        super.onDestroy();
        socket.destroySocket();
    }
}
