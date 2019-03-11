package com.touch.area;

import android.util.Log;

public class Globals {
    public static String ip = "192.168.1.5";

    public static boolean parseResponse(String response, String signType) {
        if (!response.isEmpty() && response != null) {
            response = response.replace("{", "");
            response = response.replace("}", "");
            response = response.replace("\"", "");
            String[] parser = response.split(",");
            String[] word = parser[0].split(":");
            if (word[0] != null && word[1] != null) {
                Log.e("TYPE", word[0]);
                Log.e("BOOL", word[1]);
                if (word[0].equals(signType) && word[1].equals("true")) {
                    return true;
                }
            }
        }
        return false;
    }
}
