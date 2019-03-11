package com.touch.area;

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

    protected static class User {
        private static String ip = "192.168.1.5";
        private static String name = null;
    }

    public static void setIp(String ip) {
        User.ip = ip;
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
}
