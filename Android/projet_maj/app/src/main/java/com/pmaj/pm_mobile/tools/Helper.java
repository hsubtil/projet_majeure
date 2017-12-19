package com.pmaj.pm_mobile.tools;

import android.util.Base64;

import java.io.UnsupportedEncodingException;

/**
 * Created by Hugo on 26/10/2017.
 */

public class Helper {

    public static String createAuthToken(String email,String password){
        byte[] data = new byte[0];
        try {
            data = (email + ":" + password).getBytes("UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        String output = "Basic " + Base64.encodeToString(data, Base64.NO_WRAP);
        return output;
    }

}
