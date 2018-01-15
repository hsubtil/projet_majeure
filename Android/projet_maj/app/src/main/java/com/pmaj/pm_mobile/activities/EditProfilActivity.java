package com.pmaj.pm_mobile.activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.EditText;
import android.widget.Toast;

import com.pmaj.pm_mobile.R;

public class EditProfilActivity extends AppCompatActivity {
    private SharedPreferences mPrefs;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_edit_profil);
        mPrefs = getSharedPreferences("authToken", 0);

        //JSON { 'email': "", 'name': "", 'surname': "", 'address': "", 'cp': "", 'city':"", 'country': "", 'birthday': "" }

    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);//Menu Resource, Menu
        return true;
    }
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.my_famillies:
                //Redicrection to Login page
                Intent intentHome = new Intent(EditProfilActivity.this, HomeActivity.class);
                startActivity(intentHome);
                return true;
            case R.id.my_family_calendar:
                Toast.makeText(getApplicationContext(),"My Family Calendar Selected",Toast.LENGTH_LONG).show();
                return true;
            case R.id.my_family_map:
                Toast.makeText(getApplicationContext(),"My Family Map Selected",Toast.LENGTH_LONG).show();
                return true;
            case R.id.icon_profil:
                LoginActivity.getSocketInstance().emitGetProfile(mPrefs.getString("token",""), mPrefs.getString("email",""));
                return true;
            case R.id.log_out :
                SharedPreferences.Editor mEditor = mPrefs.edit();
                mEditor.putLong("lastLogin", 0).apply();
                mEditor.putString("token",null).apply();
                mEditor.putString("name",null).apply();
                mEditor.putString("email",null).apply();
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
