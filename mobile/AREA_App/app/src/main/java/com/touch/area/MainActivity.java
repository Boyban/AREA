package com.touch.area;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import com.facebook.AccessToken;
import com.facebook.AccessTokenTracker;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.Profile;
import com.facebook.ProfileTracker;
import com.facebook.login.LoginResult;
import com.facebook.login.widget.LoginButton;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Arrays;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

public class MainActivity extends AppCompatActivity implements OnClickListener {

    private EditText _emailView;
    private EditText _passwordView;
    Button _signIn = null;
    Button _register = null;
    TextView _forgotPassword = null;

    //FACEBOOK
    LoginButton _facebook = null;
    CallbackManager callbackManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        _emailView = (EditText) findViewById(R.id.email);
        _passwordView = (EditText) findViewById(R.id.password);

        _signIn = (Button) findViewById(R.id.sign_in);
        _register = (Button) findViewById(R.id.register);
        _facebook = (LoginButton) findViewById(R.id.facebook);
        _forgotPassword = (TextView) findViewById(R.id.forgot_password);

        _signIn.setOnClickListener(this);
        _register.setOnClickListener(this);
        _facebook.setOnClickListener(this);
        _forgotPassword.setOnClickListener(this);

        AlertDialog.Builder alert = new AlertDialog.Builder(this);

        alert.setTitle("Adresse IP");
        alert.setMessage("Veuillez entrer l'adresse ip du serveur," +
                " si aucune adresse Ip n'est entrée EPITECH sera par défaut");
        alert.setCancelable(false);

        // Set an EditText view to get server ip
        final EditText _ipView = new EditText(this);
        alert.setView(_ipView);

        final String ip = _ipView.getText().toString();
        alert.setPositiveButton("Ok", new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int whichButton) {
                if (!TextUtils.isEmpty(ip))
                    Globals.setIp(ip);
            }
        });
        alert.show();

        callbackManager = CallbackManager.Factory.create();
        _facebook.setReadPermissions(Arrays.asList("public_profile", "user_friends"));

        //FACEBOOK AUTO LOGIN
        /*AccessToken accessToken = AccessToken.getCurrentAccessToken();
        Profile profile = Profile.getCurrentProfile();
        final boolean isLoggedIn = accessToken != null && !accessToken.isExpired();

        if (isLoggedIn && profile != null && !Globals.isLogout()) {
            try {
                Log.e("AUTO LOGIN", "autolog facebook success");
                    String urlParameters = "{\"accessToken\":\"" + accessToken.getToken() +
                            "\",\"userId\":\"" + accessToken.getUserId() + "\"}";
                    String response = new HttpUrlConnection(this).execute("signinFacebook",
                            urlParameters, "POST").get(5, TimeUnit.SECONDS);
                    Globals.setName(profile.getName());
                if (Globals.parseResponse(response, "logged")) {
                    Intent intent = new Intent(MainActivity.this, MenuActivity.class);
                    startActivity(intent);
                }
            } catch (ExecutionException e) {
                e.printStackTrace();
            } catch (InterruptedException e) {
                e.printStackTrace();
            } catch (TimeoutException e) {
                e.printStackTrace();
            }
        } else {*/
            //FACEBOOK ONCLICK EVENT
            _facebook.registerCallback(callbackManager, new FacebookCallback<LoginResult>() {
                @Override
                public void onSuccess(LoginResult loginResult) {
                    AccessTokenTracker accessTokenTracker = new AccessTokenTracker() {
                        @Override
                        protected void onCurrentAccessTokenChanged(AccessToken oldAccessToken,
                                                                   AccessToken currentAccessToken) {
                            Profile.fetchProfileForCurrentAccessToken();
                            AccessToken.setCurrentAccessToken(currentAccessToken);

                        }
                    };

                    accessTokenTracker.startTracking();
                    ProfileTracker profileTracker = new ProfileTracker() {
                        @Override
                        protected void onCurrentProfileChanged(Profile profile, Profile profile1) {

                        }
                    };
                    profileTracker.startTracking();

                    //GET ACCESS TOKEN & USER PROFILE
                    AccessToken accessToken = loginResult.getAccessToken();
                    Profile profile = Profile.getCurrentProfile();
                    if (profile != null)
                        Globals.setName(profile.getName());
                    try {
                        String urlParameters = "{\"accessToken\":\"" + accessToken.getToken() +
                            "\",\"userId\":\"" + accessToken.getUserId() + "\"}";
                        String response = new HttpUrlConnection(MainActivity.this).execute("signinFacebook",
                                urlParameters, "POST").get(5, TimeUnit.SECONDS);
                        try {
                            String json = response;
                            Globals.findTokenInJson(json);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        if (Globals.parseResponse(response, "logged")) {
                            Globals.setLogout(false);
                            Intent intent = new Intent(MainActivity.this, MenuActivity.class);
                            startActivity(intent);
                        }
                    } catch (ExecutionException e) {
                        e.printStackTrace();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    } catch (TimeoutException e) {
                        e.printStackTrace();
                    }
                }

                @Override
                public void onCancel() {
                    //TODO Put Cancel Condition
                }

                @Override
                public void onError(FacebookException error) {
                    //TODO PUT Error
                }
            });
        //}
    }

    @Override
	public void onClick(View view) {
		switch (view.getId()) {
            case R.id.sign_in:
            {
                try {
                    if (!attemptLogin()) {
                        Globals.setLogout(false);
                        Intent intent = new Intent(MainActivity.this, MenuActivity.class);
                        startActivity(intent);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                break;
            }
            case R.id.register:
            {
                Intent intent = new Intent(MainActivity.this, RegisterActivity.class);
                startActivity(intent);
                break;
            }
            case R.id.forgot_password:
            {
                //TODO FORGOT PASSWORD
                break;
            }
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        callbackManager.onActivityResult(requestCode, resultCode, data);
        super.onActivityResult(requestCode, resultCode, data);
    }

    private boolean attemptLogin() throws Exception {
        boolean cancel = false;

        _emailView.setError(null);
        _passwordView.setError(null);

        String email = _emailView.getText().toString();
        String password = _passwordView.getText().toString();

        if (TextUtils.isEmpty(password) || !isPasswordValid(password)) {
            _passwordView.setError(getString(R.string.error_invalid_password));
            cancel = true;
        }
        if (TextUtils.isEmpty(email)) {
            _emailView.setError(getString(R.string.error_field_required));
            cancel = true;
        } else if (!isEmailValid(email)) {
            _emailView.setError(getString(R.string.error_invalid_email));
            cancel = true;
        }
        if (!cancel) {
            String urlParameters = "{\"mail\":\"" + email + "\",\"password\":\"" + password + "\"}";
            String response = new HttpUrlConnection(MainActivity.this).execute("signin",
                    urlParameters, "POST").get(5, TimeUnit.SECONDS);
                        try {
                            String json = response;
                            Globals.findTokenInJson(json);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
            if (!Globals.parseResponse(response, "logged")) {
                cancel = true;
            }
        }
        return cancel;
    }

    private boolean isEmailValid(String email) {
        if (email.length() < 7 || !email.contains("@"))
            return false;
        return true;
    }

    private boolean isPasswordValid(String password) {
        return password.length() > 4;
    }
}
