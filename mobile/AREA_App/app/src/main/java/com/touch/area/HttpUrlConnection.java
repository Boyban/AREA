package com.touch.area;

import android.app.ProgressDialog;
import android.os.AsyncTask;
import android.util.Log;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class HttpUrlConnection extends AsyncTask<String, Void, String> {
    private ProgressDialog dialog;

    public HttpUrlConnection(MainActivity activity) {
        dialog = new ProgressDialog(activity);
    }

    public HttpUrlConnection(RegisterActivity activity) {
        dialog = new ProgressDialog(activity);
    }

    @Override
    protected void onPreExecute() {
        dialog.setMessage("Retrieving data...");
        dialog.show();
    }

    @Override
    protected String doInBackground(String... strings) {

        if ((strings[0] != null || strings[1] != null)
                || (strings[0].isEmpty() || strings[1].isEmpty())) {
            String targetURL = "http://" + Globals.ip + ":8080/api/" + strings[0];
            String json = strings[1];
            HttpURLConnection connection = null;

            try {
                //Create connection
                Log.e("URL", targetURL);
                URL url = new URL(targetURL);
                connection = (HttpURLConnection) url.openConnection();

                connection.setRequestMethod("POST");

                connection.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
                connection.setRequestProperty("Content-Language", "en-US");
                connection.setRequestProperty("Accept", "application/json");


                connection.setUseCaches(false);
                connection.setDoOutput(true);

                //Send request
                DataOutputStream wr = new DataOutputStream(
                        connection.getOutputStream());
                wr.writeBytes(json);
                wr.close();

                //Get Response
                InputStream is = connection.getInputStream();
                BufferedReader rd = new BufferedReader(new InputStreamReader(is));
                StringBuilder response = new StringBuilder(); // or StringBuffer if Java version 5+
                String line;
                while ((line = rd.readLine()) != null) {
                    response.append(line);
                    response.append('\r');
                }
                rd.close();
                return response.toString();
            } catch (Exception e) {
                e.printStackTrace();
                Log.e("error", String.valueOf(e));
                return null;
            } finally {
                if (connection != null) {
                    connection.disconnect();
                }
            }
        }
        return null;
    }

    @Override
    protected void onPostExecute(String response) {
        if (dialog.isShowing()) {
            dialog.dismiss();
        }
        Log.e("RESPONSE", response);
    }
}
