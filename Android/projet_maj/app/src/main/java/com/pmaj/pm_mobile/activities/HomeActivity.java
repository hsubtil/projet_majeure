package com.pmaj.pm_mobile.activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Toast;

import com.pmaj.pm_mobile.R;
import com.pmaj.pm_mobile.tools.NetworkCom;

import java.util.Date;

public class HomeActivity extends AppCompatActivity {
    private Button family_button;
    private Button code_button;
    private Button add_family;
    private Button log_out;
    private ImageView icon_profil;
    private SharedPreferences mPrefs;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
        mPrefs = getSharedPreferences("authToken", 0);

        log_out = (Button) findViewById(R.id.log_out);
        icon_profil = (ImageView) findViewById(R.id.icon_profil);

        family_button = (Button) findViewById(R.id.family_button);
        code_button = (Button) findViewById(R.id.code_button);
        add_family = (Button) findViewById(R.id.add_family);


        log_out.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                SharedPreferences.Editor mEditor = mPrefs.edit();
                mEditor.putLong("lastLogin", 0);
                mEditor.commit();

                //Redicrection to Login page
                Intent intentLogged = new Intent(HomeActivity.this, LoginActivity.class);
                startActivity(intentLogged);


            }
        });

        icon_profil.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //Redicrection to Login page
                Intent intentLogged = new Intent(HomeActivity.this, ProfilActivity.class);
                startActivity(intentLogged);
            }
        });
    }


}
