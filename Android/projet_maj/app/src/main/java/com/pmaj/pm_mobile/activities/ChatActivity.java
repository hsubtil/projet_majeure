package com.pmaj.pm_mobile.activities;

import android.content.SharedPreferences;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import com.pmaj.pm_mobile.R;
import com.pmaj.pm_mobile.model.Family;
import com.pmaj.pm_mobile.model.Message;
import com.pmaj.pm_mobile.tools.FamilyAdapter;
import com.pmaj.pm_mobile.tools.MessagesAdapter;
import com.pmaj.pm_mobile.tools.NetworkCom;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import io.socket.emitter.Emitter;

//TODO AFFICHAGE EN TEMPS REELLE DES MESSAGES
//TODO SCROLL BOTTOM POUR AVOIR LES MESSAGES LES PLUS RECENTS
//TODO AFFICHAGE DE LA BAR D'ENVOIE DES MESSAGES CONSTAMMENT.
public class ChatActivity extends AppCompatActivity {
    private TextView familyName;
    private RecyclerView messages;
    private SwipeRefreshLayout mSwipeRefreshLayout;
    private ScrollView scroll_messages;
    private EditText new_message;
    private Button sendBtn;
    private String code;
    private List<Message> list = new ArrayList<Message>();

    private NetworkCom socket;
    private SharedPreferences mPrefs;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);
        code = getIntent().getStringExtra("family_code");
        /**
         * Connection to serveur
         * */
        mPrefs = getSharedPreferences("authToken", 0);

        //Socket
        socket = new NetworkCom();
        socket.getmSocket().on("load_messages_reply", onMessagesSuccess);

        socket.getmSocket().on("new_message_available", onMessageSentSuccess);
        socket.getmSocket().on("error", onMessagesFail);

        /*
        * Link variables to object on page
        * */
        mSwipeRefreshLayout = (SwipeRefreshLayout) findViewById(R.id.swipeRefreshLayout);
        scroll_messages = (ScrollView) findViewById(R.id.scroll_messages);
        familyName = (TextView) findViewById(R.id.familyName);
        messages = (RecyclerView) findViewById(R.id.messages);
        new_message = (EditText) findViewById(R.id.new_message);
        sendBtn = (Button) findViewById(R.id.sendBtn);


        // Retrieve Family Name selected
        familyName.setText(getIntent().getStringExtra("family_name"));


        //Linking Layout Manager to Recycler View
        RecyclerView.LayoutManager mLayoutManager = new LinearLayoutManager(this);
        messages.setLayoutManager(mLayoutManager);
        messages.setHasFixedSize(true);

        //Retrieve all messages
        socket.emitGetMessages(mPrefs.getString("authToken", ""), code);


        // Listener when we click on send Button to send a new message
        sendBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String message = new_message.getText().toString();
                Date date = Calendar.getInstance().getTime();
                String stringDate = date.toString();
                String name = mPrefs.getString("name", "");

                JSONObject jsonMsg = new JSONObject();

                try {
                    jsonMsg.put("code", code);
                    jsonMsg.put("user", name);
                    jsonMsg.put("date", stringDate);
                    jsonMsg.put("content", message);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                new_message.setText("");
                socket.emitSendMessage(mPrefs.getString("authToken", ""), jsonMsg);

            }
        });
        //Stop refreshing when all messages retrieved
        mSwipeRefreshLayout.setRefreshing(false);

        // Implementation of Swipe to Refresh
        mSwipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                // Refresh items
                socket.emitGetMessages(mPrefs.getString("authToken", ""), getIntent().getStringExtra("family_code"));
                mSwipeRefreshLayout.setRefreshing(false);
            }
        });

    }

    private Emitter.Listener onMessagesSuccess = new Emitter.Listener() {

        @Override
        public void call(Object... args) {
            JSONArray obk = (JSONArray) args[0];

            try {


                for (int i = 0; i < obk.length(); i++) {
                    JSONObject familyObj = (JSONObject) obk.getJSONObject(i);
                    Message f = new Message();
                    f.setSender(familyObj.getString("user"));
                    f.setMessageText(familyObj.getString("content"));
                    list.add(f);
                }

                displayMessages();
            } catch (JSONException e) {
                e.printStackTrace();
            }

            return;
        }
    };
    private Emitter.Listener onMessageSentSuccess = new Emitter.Listener() {

        @Override
        public void call(Object... args) {
            JSONObject newMessage = (JSONObject) args[0];
            Message f = new Message();
            try {
                f.setSender(newMessage.getString("user"));
                f.setMessageText(newMessage.getString("content"));
                list.add(f);
            } catch (JSONException e) {
                e.printStackTrace();
            }

            displayMessages();
            return;
        }
    };

    private void displayMessages() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {

                RecyclerView.Adapter messagesAdapter = new MessagesAdapter(list, ChatActivity.this);
                messages.setAdapter(messagesAdapter);


            }
        });
    }

    private Emitter.Listener onMessagesFail = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            return;
        }
    };


}
