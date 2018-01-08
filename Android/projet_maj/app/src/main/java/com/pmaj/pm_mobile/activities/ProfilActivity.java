package com.pmaj.pm_mobile.activities;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.EditText;
import android.widget.TextView;

import com.pmaj.pm_mobile.R;

import org.w3c.dom.Text;

public class ProfilActivity extends AppCompatActivity {
    private TextView email;
    private TextView name;
    private TextView surname;
    private TextView address;
    private TextView birthday;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profil);

        email = (TextView) findViewById(R.id.email);
        name = (TextView) findViewById(R.id.name);
        surname = (TextView) findViewById(R.id.surname);
        address = (TextView) findViewById(R.id.address);
        birthday = (TextView) findViewById(R.id.birthday);

        email.setText(getIntent().getStringExtra("email"));
        name.setText(getIntent().getStringExtra("name"));
        surname.setText(getIntent().getStringExtra("surname"));
        address.setText(getIntent().getStringExtra("address"));
        birthday.setText(getIntent().getStringExtra("birthday"));
    }
}
