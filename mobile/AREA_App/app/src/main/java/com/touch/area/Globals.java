package com.touch.area;

import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class Globals {

   public static boolean parseResponse(String response, String signType) {
        if (!response.isEmpty() && response != null) {
            response = response.replace("{", "");
            response = response.replace("}", "");
            response = response.replace("\"", "");
            String[] parser = response.split(",");
            String[] word = parser[0].split(":");
            if (word[0] != null && word[1] != null) {
                if (word[0].equals(signType) && word[1].equals("true")) {
                    return true;
                }
            }
        }
        return false;
    }

    public static boolean findTokenInJson(String response) throws JSONException {
        if (!response.isEmpty() && response != null) {
            JSONObject obj = new JSONObject(response);
            String accessToken = obj.getString("token");

            JSONObject token = new JSONObject(accessToken);
            String id = obj.getString("id");
            if (id != null)
                setToken(id);
            return true;
        }
        return false;
    }

    protected static class User {
        private static String ip = "10.41.172.57";
        private static String name = "John Doe";
        private static String token = null;
        private static String id = null;
        private static boolean logout = false;
    }

    public static String getName() {
        return User.name;
    }

    public static void setName(String name) {
        User.name = name;
    }

    public static String getIp() {
        return User.ip;
    }

    public static void setIp(String ip) {
        User.ip = ip;
    }

    public static String getToken() {
        return User.token;
    }

    public static void setToken(String token) {
        User.token = token;
    }

    public static String getId() {
        return User.id;
    }

    public static void setId(String id) {
        User.id = id;
    }

    public static Boolean isLogout() {
       return User.logout;
    }

    public static void setLogout(boolean logout) {
       User.logout = logout;
    }

}
