package com.pmaj.pm_mobile.tools;

import android.content.SharedPreferences;

import org.json.JSONException;
import org.json.JSONObject;

import java.net.URI;
import java.util.ArrayList;
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
        URI uri = URI.create("http://192.168.1.102:1337/");
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
        mSocket.emit("signUp_attempt",json);
    }

    public void emitFamilleUser(String login) {
        JSONObject json = new JSONObject();
        try {
            json.put("email",login);
        }
        catch (JSONException e) {
            e.printStackTrace();
        }
        mSocket.emit("request_family",json);
    }

  /*  public void emitUserTyping(String login, String sessionToken){// String mimType, String data){
        JSONObject json = new JSONObject();
        try {
            json.put("login", login);
            json.put("token",sessionToken);
            //attachment.put("mimeType",mimType);
            //attachment.put("data",data);
        }
        catch (JSONException e) {
            e.printStackTrace();
        }
        mSocket.emit("user_typing_outbound_msg",json);

    }*/
   /* public void emitMessage(String login, String sessionToken, String uuid, String message){// String mimType, String data){
        JSONObject json = new JSONObject();
        JSONObject attachment = new JSONObject();
        List attaArray = new ArrayList();
        try {
            json.put("login", login);
            json.put("token",sessionToken);
            json.put("uuid",uuid);
            json.put("message",message);
            json.put("attachments",attaArray);
            //attachment.put("mimeType",mimType);
            //attachment.put("data",data);


        }
        catch (JSONException e) {
            e.printStackTrace();
        }
        mSocket.emit("outbound_msg",json);

    }*/

    public void destroySocket() {
        mSocket.disconnect();
    }


}
