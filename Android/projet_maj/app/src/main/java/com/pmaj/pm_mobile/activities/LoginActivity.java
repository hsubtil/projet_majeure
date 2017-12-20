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

        //Socket
        socket = new NetworkCom();
        socket.getmSocket().on("auth_success", onAuthSuccess);
        socket.getmSocket().on("auth_failed", onAuthFail);

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

                //TODO JUSTE POUR TESTER LA REDIRECTION DE PAGE ET LES AUTRES PAGES
                //Redicrection to Home page
                Intent intentLogged = new Intent(LoginActivity.this, HomeActivity.class);
                startActivity(intentLogged);

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
            try {
                token = obk.getString("token");
            } catch (JSONException e) {
                e.printStackTrace();
            }

            SharedPreferences.Editor mEditor = mPrefs.edit();
            // Shared preference declaration
            mEditor.putString("sessionToken", token).apply();
            String authToken = Helper.createAuthToken(email.getText().toString(), password.getText().toString());
            mEditor.putString("authToken", authToken).apply(); // Create / update TOKEN

            //Redicrection to Home page
            Intent intentLogged = new Intent(LoginActivity.this, HomeActivity.class);
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
        if (lastLogin != 0 && (acutallogin - lastLogin) < 300000) {
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
