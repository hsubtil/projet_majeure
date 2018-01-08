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


    private NetworkCom socket;
    private SharedPreferences mPrefs;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }


}
