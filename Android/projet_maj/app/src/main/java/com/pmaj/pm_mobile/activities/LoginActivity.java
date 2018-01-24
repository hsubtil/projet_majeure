package com.pmaj.pm_mobile.activities;

import android.app.Dialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
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
    private static NetworkCom socket;

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
                socket.emitConnect(email.getText().toString(), password.getText().toString());
                //Toast.makeText(LoginActivity.this, "Login Attempt", Toast.LENGTH_LONG).show();

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
            String userName ="";
            try {
                token = obk.getString("token");
                userName = obk.getString("name");
            } catch (JSONException e) {
                e.printStackTrace();
            }


            SharedPreferences.Editor mEditor = mPrefs.edit();
            // Shared preference declaration
            mEditor.putLong("lastLogin", new Date().getTime());                 // Add a time to check timeout
            mEditor.putString("authLogin", email.getText().toString());     // Add Login
            mEditor.putString("token", token).apply();
            mEditor.putString("name",userName).apply();
            mEditor.putString("email",email.getText().toString()).apply();
            mEditor.commit();

            //Redicrection to Home page
            Intent intentLogged = new Intent(LoginActivity.this, HomeActivity.class);
            startActivity(intentLogged);

            return;
        }
    };

    private Emitter.Listener onAuthFail = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    final Dialog dialog = new Dialog(LoginActivity.this);
                    dialog.setContentView(R.layout.pop_up_window_event_status);
                    TextView status = (TextView) dialog.findViewById(R.id.title);
                    status.setText("Ouuuups an error occured please try again");
                    dialog.show();
                }
            });
            return;
        }
    };

    private void checkConnectionToken() {
        Long lastLogin = mPrefs.getLong("lastLogin", 0);
        //long acutallogin = new Date().getTime();
        if (lastLogin != 0) {
            Toast.makeText(LoginActivity.this, "Hello again !", Toast.LENGTH_LONG).show();
           //Redirection vers Page Home
            Intent intentLogged = new Intent(LoginActivity.this, FingerPrintActivity.class);
            startActivity(intentLogged);
        }

    }

    public static NetworkCom getSocketInstance (){
        return socket;
    }

     @Override
    protected void onDestroy() {
        super.onDestroy();
        socket.destroySocket();
    }
}
