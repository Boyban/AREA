package com.touch.area;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.RecyclerView;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

public class MenuActivity extends AppCompatActivity {

    private TextView _welcome;
    RecyclerView _recyclerView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_menu);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        _welcome = (TextView) findViewById(R.id.welcome);
        _welcome.setText("Welcome " + Globals.getName());
    }

    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.menu_logout, menu);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                Intent returnIntent = new Intent(this, MainActivity.class);
                setResult(RESULT_CANCELED, returnIntent);
                finish();
                return true;
            case R.id.action_logout:
                /*try {
                    String urlParameters = "{\"Authorization\":\"" + Globals.getToken() + "\"}";
                    String response = new HttpUrlConnection(this).execute("logout",
                            urlParameters, "GET").get(5, TimeUnit.SECONDS);
                    if (Globals.parseResponse(response, "logout")) {*/
                        Globals.setLogout(true);
                        Intent intent = new Intent(this, MainActivity.class);
                        setResult(RESULT_CANCELED, intent);
                        finish();
                        return true;
                    //}
                /*} catch (ExecutionException e) {
                    e.printStackTrace();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (TimeoutException e) {
                    e.printStackTrace();
                }*/
        }
        return super.onOptionsItemSelected(item);
    }
}
