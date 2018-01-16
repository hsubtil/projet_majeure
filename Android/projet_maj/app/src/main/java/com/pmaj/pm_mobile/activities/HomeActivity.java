package com.pmaj.pm_mobile.activities;

import android.app.Dialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.media.Image;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.pmaj.pm_mobile.R;
import com.pmaj.pm_mobile.model.Family;
import com.pmaj.pm_mobile.tools.FamilyAdapter;
import com.pmaj.pm_mobile.tools.NetworkCom;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Text;

import java.util.ArrayList;
import java.util.List;

import io.socket.emitter.Emitter;

public class HomeActivity extends AppCompatActivity {
    private Button codeButton;
    private Button add_family;
    private TextView calendar;
    private TextView family;
    private TextView map;
    private RecyclerView family_list;
    List<Family> familyList = new ArrayList<Family>();
    private SharedPreferences mPrefs;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
        mPrefs = getSharedPreferences("authToken", 0);
        /*
        * Nav Bar */
        calendar = (TextView) findViewById(R.id.calendar);
        family = (TextView) findViewById(R.id.family);
        map = (TextView) findViewById(R.id.map);


        calendar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //Redicrection to Calendar page
                Intent intentLogged = new Intent(HomeActivity.this, CalendarActivity.class);
                startActivity(intentLogged);
            }
        });

        map.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //Redicrection to Map page
                Intent intentLogged = new Intent(HomeActivity.this, MapActivity.class);
                startActivity(intentLogged);
            }
        });

        family.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
               // Intent intentLogged = new Intent(HomeActivity.this,ChatActivity.class);
                //startActivity(intentLogged);
            }
        });

        add_family = (Button) findViewById(R.id.add_family);

        add_family.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                final Dialog dialog = new Dialog(HomeActivity.this);

                dialog.setContentView(R.layout.pop_up_window_new_family);
                dialog.setTitle("New family");

                Button btnCreate = (Button) dialog.findViewById(R.id.btnCreate);
                Button btnJoin = (Button) dialog.findViewById(R.id.btnJoin);

                btnCreate.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {

                        dialog.dismiss();
                        final Dialog createFamilyDialog = new Dialog(HomeActivity.this);

                        createFamilyDialog.setContentView(R.layout.pop_up_window_create_family);
                        createFamilyDialog.setTitle("Create family");

                        Button btnJoinFamily = (Button) createFamilyDialog.findViewById(R.id.btnCreateFamily);
                        final EditText codeFamily = (EditText) createFamilyDialog.findViewById(R.id.nameFamily);
                        createFamilyDialog.show();

                        btnJoinFamily.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                String SnameFamily = codeFamily.getText().toString();
                                LoginActivity.getSocketInstance().emitCreateFamily(mPrefs.getString("token", ""), mPrefs.getString("email", ""),SnameFamily);
                                createFamilyDialog.dismiss();
                            }
                        });
                    }
                });
                btnJoin.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {

                        dialog.dismiss();
                        final Dialog joinFamilyDialog = new Dialog(HomeActivity.this);

                        joinFamilyDialog.setContentView(R.layout.pop_up_window_join_family);
                        joinFamilyDialog.setTitle("Join family");

                        Button btnJoinFamily = (Button) joinFamilyDialog.findViewById(R.id.btnJoinFamily);
                        final EditText codeFamily = (EditText) joinFamilyDialog.findViewById(R.id.codeFamily);
                        joinFamilyDialog.show();

                        btnJoinFamily.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                String ScodeFamily = codeFamily.getText().toString();
                                LoginActivity.getSocketInstance().emitJoinFamily(mPrefs.getString("token", ""), mPrefs.getString("email", ""),ScodeFamily);
                                joinFamilyDialog.dismiss();
                            }
                        });
                    }
                });
                dialog.show();
            }
        });

        //Socket
        LoginActivity.getSocketInstance().getmSocket().on("add_family_to_user_success", onAddFamilyToUserSuccess);
        LoginActivity.getSocketInstance().getmSocket().on("request_family_reply", onFamiliesSuccess);
        family_list = (RecyclerView) findViewById(R.id.family_list);

        family_list.setHasFixedSize(true);

        RecyclerView.LayoutManager mLayoutManager = new LinearLayoutManager(this);
        family_list.setLayoutManager(mLayoutManager);

        LoginActivity.getSocketInstance().emitGetFamilies(mPrefs.getString("token", ""), mPrefs.getString("email", ""));

    }

    private Emitter.Listener onFamiliesSuccess = new Emitter.Listener() {

        @Override
        public void call(Object... args) {
            JSONObject obk = (JSONObject) args[0];
            //JSON { ‘email’:, ‘family’:[]}

            try {
                JSONArray familyArray = (JSONArray) obk.getJSONArray("families");

                for (int i = 0; i < familyArray.length(); i++) {
                    JSONObject familyObj = (JSONObject) familyArray.getJSONObject(i);
                    Family f = new Family();
                    f.setName(familyObj.getString("name"));
                    f.setCode(familyObj.getString("code"));
                    familyList.add(f);
                }

                displayFamilies(familyList);
            } catch (JSONException e) {
                e.printStackTrace();
            }

            return;
        }
    };

    private Emitter.Listener onAddFamilyToUserSuccess = new Emitter.Listener() {

        @Override
        public void call(Object... args) {
            JSONObject obk = (JSONObject) args[0];

            try {
                Family f = new Family();
                f.setName(obk.getString("name"));
                f.setCode(obk.getString("code"));
                familyList.add(f);
            } catch (JSONException e) {
                e.printStackTrace();
            }
            displayFamilies(familyList);

            return;
        }
    };


    private void displayFamilies(final List<Family> familyList) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                RecyclerView.Adapter myAdapter = new FamilyAdapter(familyList, HomeActivity.this);
                family_list.setAdapter(myAdapter);
            }
        });
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
            case R.id.families :
                return true;
            case R.id.icon_profil:
                //Redicrection to Profile page
                Intent intentLogged = new Intent(HomeActivity.this, ProfilActivity.class);
                startActivity(intentLogged);
                return true;
            case R.id.log_out:
                SharedPreferences.Editor mEditor = mPrefs.edit();
                mEditor.putLong("lastLogin", 0).apply();
                mEditor.putString("token", null).apply();
                mEditor.putString("name", null).apply();
                mEditor.putString("email", null).apply();
                //mEditor.clear().apply();
                mEditor.commit();

                //Redicrection to Login page
                Intent intentLoggedOut = new Intent(HomeActivity.this, LoginActivity.class);
                startActivity(intentLoggedOut);
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }


}
