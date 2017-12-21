package com.pmaj.pm_mobile.activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.pmaj.pm_mobile.R;
import com.pmaj.pm_mobile.model.Family;
import com.pmaj.pm_mobile.tools.Helper;
import com.pmaj.pm_mobile.tools.NetworkCom;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
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
        socket.getmSocket().on("node_error", onNodeError);
        socket.getmSocket().on("request_family_reply",onRequestFamilyReply);

        //checkConnectionToken();


        connect.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                progressBar.setVisibility(View.VISIBLE);
                SharedPreferences.Editor mEditor = mPrefs.edit();
                mEditor.putLong("lastLogin", new Date().getTime());                 // Add a time to check timeout
                mEditor.putString("authLogin", email.getText().toString());     // Add Login
                mEditor.commit();
                socket.emitConnect(email.getText().toString(), password.getText().toString());
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

            String login = "";
            try {
                login = obk.getString("login");
            } catch (JSONException e) {
                e.printStackTrace();
            }

            SharedPreferences.Editor mEditor = mPrefs.edit();
            // Shared preference declaration
            mEditor.putString("sessionToken", login).apply();
            String authToken = Helper.createAuthToken(email.getText().toString(), password.getText().toString());
            mEditor.putString("authToken", authToken).apply(); // Create / update TOKEN

            socket.emitFamilleUser(login);
            //Redicrection to Home page
            Intent intentLogged = new Intent(LoginActivity.this, HomeActivity.class);
            startActivity(intentLogged);

            return;
        }
    };

    private Emitter.Listener onRequestFamilyReply = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            JSONObject obk = (JSONObject) args[0];
            ArrayList<String> list = new ArrayList<String>();
            //TODO TRANSFORMER JSONARRAY FAMILY ARRAY POUR RECUPERATION ET AFFICHAGE DES DONNES DE LA FAMILLE
            try {
               JSONArray familyArray = (JSONArray)obk.getJSONArray("family");
                if (familyArray != null) {
                    int len = familyArray.length();
                    for (int i=0;i<len;i++){
                        list.add(familyArray.get(i).toString());
                    }
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }


            return;
        }
    };

    private Emitter.Listener onAuthFail = new Emitter.Listener() {
        @Override
        public void call(Object... args) {

            return;
        }
    };


    private Emitter.Listener onNodeError = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            //this.runOnUiThread(show_toast);
            return;
        }
    };

    private void checkConnectionToken() {
        Long lastLogin = mPrefs.getLong("lastLogin", 36);
        long acutallogin = new Date().getTime();
        if (lastLogin != 0 && (acutallogin - lastLogin) < 30000) {
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
