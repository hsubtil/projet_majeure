package com.pmaj.pm_mobile.activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.Toast;

import com.pmaj.pm_mobile.R;
import com.pmaj.pm_mobile.model.Family;
import com.pmaj.pm_mobile.tools.Helper;
import com.pmaj.pm_mobile.tools.MyAdapter;
import com.pmaj.pm_mobile.tools.NetworkCom;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import io.socket.emitter.Emitter;

//TODO SEPARE METHODE NAVBAR ET HOME PAGE
public class HomeActivity extends AppCompatActivity {
    private Button family_button;
    private Button code_button;
    private Button add_family;
    private Button log_out;
    private ImageView icon_profil;
    private RecyclerView family_list;
    private NetworkCom socket;
    private SharedPreferences mPrefs;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
        mPrefs = getSharedPreferences("authToken", 0);

        //Socket
        socket = new NetworkCom();
        socket.getmSocket().on("request_profile_reply", onProfilSuccess);
        socket.getmSocket().on("request_family_reply", onFamiliesSuccess);
        socket.getmSocket().on("error", onProfilFail);

        log_out = (Button) findViewById(R.id.log_out);
        icon_profil = (ImageView) findViewById(R.id.icon_profil);
        family_list = (RecyclerView) findViewById(R.id.family_list);




        socket.emitGetFamilies(mPrefs.getString("authToken", ""), getIntent().getStringExtra("email"));


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
                socket.emitGetProfile(mPrefs.getString("authToken", ""), getIntent().getStringExtra("email"));
            }
        });
    }

    private Emitter.Listener onFamiliesSuccess = new Emitter.Listener() {

        @Override
        public void call(Object... args) {
            JSONObject obk = (JSONObject) args[0];
            //JSON { ‘email’:, ‘families’:[]}

            try {
                JSONArray familyArray = (JSONArray) obk.getJSONArray("families");

                List<Family> list = new ArrayList<Family>();
                for (int i=0; i<familyArray.length(); i++) {
                    JSONObject familyObj = (JSONObject) familyArray.getJSONObject(i);
                    Family f = new Family();
                    f.setName(familyObj.getString("name"));
                    f.setCode(familyObj.getString("code"));
                    list.add(f);
                }

                displayFamilies(list);
            } catch (JSONException e) {
                e.printStackTrace();
            }

            return;
        }
    };


    private void displayFamilies(List<Family> familyList) {
        family_list.setHasFixedSize(true);

        RecyclerView.LayoutManager mLayoutManager = new LinearLayoutManager(this);
        family_list.setLayoutManager(mLayoutManager);

        RecyclerView.Adapter myAdapter = new MyAdapter(familyList, HomeActivity.this);
        family_list.setAdapter(myAdapter);

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
            Intent intentLogged = new Intent(HomeActivity.this, ProfilActivity.class);
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
