package com.pmaj.pm_mobile.activities;

import android.app.Dialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.CalendarView;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.pmaj.pm_mobile.R;
import com.pmaj.pm_mobile.tools.Helper;
import com.pmaj.pm_mobile.tools.NetworkCom;

import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import io.socket.emitter.Emitter;


public class SignUpActivity extends AppCompatActivity {
    private EditText name;
    private EditText surname;
    private EditText email;
    private EditText confemail;
    private EditText password;
    private EditText confpassword;
    private EditText address;
    private EditText cp;
    private EditText city;
    private EditText country;
    private EditText birthday;
    private Button signUp;


    private NetworkCom socket;
    private SharedPreferences mPrefs;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup);
        name = (EditText) findViewById(R.id.name);
        surname = (EditText) findViewById(R.id.surname);
        email = (EditText) findViewById(R.id.email);
        confemail = (EditText) findViewById(R.id.confemail);
        password = (EditText) findViewById(R.id.password);
        confpassword = (EditText) findViewById(R.id.confpassword);
        address = (EditText) findViewById(R.id.address);
        cp = (EditText) findViewById(R.id.cp);
        city = (EditText) findViewById(R.id.city);
        country = (EditText) findViewById(R.id.country);
        birthday = (EditText) findViewById(R.id.birthday);
        signUp = (Button) findViewById(R.id.signUp);

        //Convert birthday from calendar to string
        //String dateformat ="dd/MM/yyyy";
        //SimpleDateFormat formatter = new SimpleDateFormat(dateformat);
        //Calendar calendar = Calendar.getInstance();
        //calendar.setTimeInMillis(birthday.getDate());
        //final String string_birthday = formatter.format(calendar.getTime());


        mPrefs = getSharedPreferences("authToken", 0);

        //Socket
        socket = new NetworkCom();
        socket.getmSocket().on("registration_success", onSignUpSuccess);
        socket.getmSocket().on("registration_failed", onSignUpFail);
        socket.getmSocket().on("node_error", onNodeError);

        signUp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(checkFields()){
                    socket.emitSignUp(textToString(name),textToString(surname),textToString(email),textToString(password),textToString(address),textToString(cp),textToString(city),textToString(country),textToString(birthday));
                   // Toast.makeText(SignUpActivity.this, "Sign Up Attempt", Toast.LENGTH_LONG).show();
                }


            }
        });

    }

    protected String textToString (EditText text){
        return text.getText().toString();
    }
    protected boolean checkFields (){

        if(name.getText().toString().equals(""))
        {
            showErrorEmptyField(name);
            return false;
        }
        if(surname.getText().toString().equals(""))
        {
            showErrorEmptyField(surname);
            return false;
        }
        if(email.getText().toString().equals(""))
        {
            showErrorEmptyField(email);
            return false;
        }
        if(confemail.getText().toString().equals(""))
        {
            showErrorEmptyField(confemail);
            return false;
        }
        if(password.getText().toString().equals(""))
        {
            showErrorEmptyField(password);
            return false;
        }
        if(confpassword.getText().toString().equals(""))
        {
            showErrorEmptyField(confpassword);
            return false;
        }
        if(country.getText().toString().equals(""))
        {
            showErrorEmptyField(country);
            return false;
        }
        if(birthday.getText().toString().equals("")){
            showErrorEmptyField(birthday);
            return false;
        }
        if(!checkConfirmation(email.getText().toString(),confemail.getText().toString())){
            showErrorConfirmation(email, confemail);
            return false;
        }
        if(!checkConfirmation(password.getText().toString(),confpassword.getText().toString())){
            showErrorConfirmation(password,confpassword);
            return false;
        }
        return true;
    }

    protected boolean checkConfirmation (String email, String confemail){
        if(email.equals(confemail))
            return true;
        return false;
    }
    private void showErrorConfirmation(EditText field, EditText confField) {
        field.setError("The 2 fields are different.");
        confField.setError("The 2 fields are different.");
    }

    private void showErrorEmptyField(EditText field){
        field.setError("You have to fill this field.");
    }

    private Emitter.Listener onSignUpSuccess = new Emitter.Listener() {

        @Override
        public void call(Object... args) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    final Dialog dialog = new Dialog(SignUpActivity.this);
                    dialog.setContentView(R.layout.pop_up_window_event_status);
                    TextView status = (TextView) dialog.findViewById(R.id.title);
                    status.setText("You are now registered");
                    dialog.show();
                    //Redirection to Login page
                    Intent intentLogged = new Intent(SignUpActivity.this, LoginActivity.class);
                    startActivity(intentLogged);
                }
            });


            return;
        }
    };

    private Emitter.Listener onSignUpFail = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    final Dialog dialog = new Dialog(SignUpActivity.this);
                    dialog.setContentView(R.layout.pop_up_window_event_status);
                    TextView status = (TextView) dialog.findViewById(R.id.title);
                    status.setText("Ouuuups an error occured please try again");
                    dialog.show();
                    //Redirection to Login page
                    Intent intentLogged = new Intent(SignUpActivity.this, SignUpActivity.class);
                    startActivity(intentLogged);
                }
            });
            return;
        }
    };

    private Emitter.Listener onNodeError = new Emitter.Listener() {
        @Override
        public void call(Object... args) {

            return;
        }
    };
}
