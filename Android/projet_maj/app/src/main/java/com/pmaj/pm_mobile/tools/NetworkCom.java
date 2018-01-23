package com.pmaj.pm_mobile.tools;

import android.content.SharedPreferences;

import com.pmaj.pm_mobile.model.Profile;

import org.json.JSONException;
import org.json.JSONObject;

import java.net.URI;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import io.socket.client.IO;
import io.socket.client.Manager;
import io.socket.client.Socket;



/**
 * Created by Hugo on 15/11/2017.
 */

public class NetworkCom {
    private static Socket mSocket;
    private Manager.Options options;
    private Manager mManager;
    private SharedPreferences mPrefs;

    public NetworkCom(){
        URI uri = URI.create("http://192.168.1.100:1337/");
        this.mSocket = IO.socket(uri);
        this.mSocket.connect();
    }

    public Socket getmSocket() {
        return mSocket;
    }

    public void emitConnect(String email,String password){
        JSONObject json = new JSONObject();
        try {
            json.put("email", email);
            json.put("password",password);
        }
        catch (JSONException e) {
            e.printStackTrace();
        }
        mSocket.emit("auth_attempt",json);
    }

    public void emitSignUp(String name, String surname,String email,String password, String address, String cp, String city, String country, String birthday){
        JSONObject json = new JSONObject();
        try {
            json.put("name",name);
            json.put("surname",surname);
            json.put("email", email);
            json.put("password",password);
            json.put("address",address);
            json.put("cp",cp);
            json.put("city",city);
            json.put("country",country);
            json.put("birthday",birthday);
        }
        catch (JSONException e) {
            e.printStackTrace();
        }
        mSocket.emit("sign_up_attempt",json);
    }

    public void emitGetProfile(String token,String email){
        JSONObject json = new JSONObject();
        try {
            json.put("token", token);
            json.put("email",email);
        }
        catch (JSONException e) {
            e.printStackTrace();
        }
        mSocket.emit("request_profile",json);
    }

    public void emitEditProfile(String token, String email, JSONObject profile){
        JSONObject json = new JSONObject();
        try {
            json.put("token", token);
            json.put("email",email);
            json.put("profile",profile);
        }
        catch (JSONException e) {
            e.printStackTrace();
        }
        mSocket.emit("update_user_profil",json);
    }

    public void emitGetFamilies(String token,String email){
        JSONObject json = new JSONObject();
        try {
            json.put("token", token);
            json.put("email",email);
        }
        catch (JSONException e) {
            e.printStackTrace();
        }
        mSocket.emit("request_family",json);
    }

    public void emitGetMessages(String token,String code){
        JSONObject json = new JSONObject();
        try {
            json.put("token", token);
            json.put("code",code);
        }
        catch (JSONException e) {
            e.printStackTrace();
        }
        mSocket.emit("load_messages",json);
    }

    public void emitSendMessage(String token,JSONObject msg){
        JSONObject json = new JSONObject();
        try {
            json.put("token", token);
            json.put("msg",msg);
        }
        catch (JSONException e) {
            e.printStackTrace();
        }
        mSocket.emit("new_message",json);
    }

    public void emitSelectFamily(String token,String code){
        JSONObject json = new JSONObject();
        try {
            json.put("token", token);
            json.put("code",code);
        }
        catch (JSONException e) {
            e.printStackTrace();
        }
        mSocket.emit("select_family",json);
    }

    public void emitJoinFamily(String token,String email,String code){
        JSONObject json = new JSONObject();
        try {
            json.put("token", token);
            json.put("email",email);
            json.put("code",code);
        }
        catch (JSONException e) {
            e.printStackTrace();
        }
        mSocket.emit("add_family_to_user",json);
    }

    public void emitCreateFamily(String token, String email, String name) {
        JSONObject json = new JSONObject();
        try {
            json.put("token", token);
            json.put("email",email);
            json.put("family",name);
        }
        catch (JSONException e) {
            e.printStackTrace();
        }
        mSocket.emit("new_family",json);
    }

    public void emitGetListEvent(String token, String code) {
        JSONObject json = new JSONObject();
        try {
            json.put("token", token);
            json.put("code",code);
        }
        catch (JSONException e) {
            e.printStackTrace();
        }
        mSocket.emit("google_list_events",json);
    }

    public void emitCreateEvent(String token, String code, JSONObject event) {
        JSONObject json = new JSONObject();
        try {
            json.put("token", token);
            json.put("code",code);
            json.put("event",event);
        }
        catch (JSONException e) {
            e.printStackTrace();
        }
        mSocket.emit("google_set_event",json);
    }

    public void emitDeleteEvent(String token, String code, String eventId) {
        JSONObject json = new JSONObject();
        try {
            json.put("token", token);
            json.put("code",code);
            json.put("eventId",eventId);
        }
        catch (JSONException e) {
            e.printStackTrace();
        }
        mSocket.emit("google_remove_event",json);
    }


    public void destroySocket() {
        mSocket.disconnect();
    }


}
