package com.touch.area;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.text.TextUtils;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;

import com.facebook.AccessToken;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.login.LoginResult;
import com.facebook.login.widget.LoginButton;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

public class RegisterActivity extends AppCompatActivity implements OnClickListener {

    private EditText _fnameView;
    private EditText _lnameView;
    private EditText _emailView;
    private EditText _passwordView;
    private EditText _confirmPasswordView;
    Button _signUp = null;

    //FACEBOOK
    LoginButton _facebook = null;
    CallbackManager callbackManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        _fnameView = (EditText) findViewById(R.id.first_name);
        _lnameView = (EditText) findViewById(R.id.last_name);
        _emailView = (EditText) findViewById(R.id.email);
        _passwordView = (EditText) findViewById(R.id.password);
        _confirmPasswordView = (EditText) findViewById(R.id.confirm_password);
        _signUp = (Button) findViewById(R.id.sign_up);
        _facebook = (LoginButton) findViewById(R.id.facebook);

        _signUp.setOnClickListener(this);
        _facebook.setOnClickListener(this);

        //FACEBOOK REGISTRATION
        callbackManager = CallbackManager.Factory.create();
        _facebook.setReadPermissions("email");

            _facebook.registerCallback(callbackManager, new FacebookCallback<LoginResult>() {
                @Override
                public void onSuccess(LoginResult loginResult) {
                    AccessToken accessToken = loginResult.getAccessToken();
                    try {
                        String urlParameters = "{\"accessToken\":\"" + accessToken.getToken() +
                            "\",\"userId\":\"" + accessToken.getUserId() + "\"}";
                        String response = new HttpUrlConnection(RegisterActivity.this).execute("signupFacebook",
                                urlParameters).get(5, TimeUnit.SECONDS);
                        if (Globals.parseResponse(response, "register")) {
                            response = new HttpUrlConnection(RegisterActivity.this).execute("signinFacebook",
                                urlParameters).get(5, TimeUnit.SECONDS);
                            if (Globals.parseResponse(response, "logged")) {
                                Intent intent = new Intent(RegisterActivity.this, MenuActivity.class);
                                startActivity(intent);
                                finish();
                            }
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
    }

    @Override
    public void onClick(View v) {
        try {
            if (v.getId() == R.id.sign_up) {
                attemptLogin();
            }
        } catch (ExecutionException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (TimeoutException e) {
            e.printStackTrace();
        }
    }

    private boolean attemptLogin() throws ExecutionException, InterruptedException, TimeoutException {
        boolean cancel = false;

        _fnameView.setError(null);
        _lnameView.setError(null);
        _emailView.setError(null);
        _passwordView.setError(null);
        _confirmPasswordView.setError(null);

        String fname = _fnameView.getText().toString();
        String lname = _lnameView.getText().toString();
        String email = _emailView.getText().toString();
        String password = _passwordView.getText().toString();
        String confirm_password = _confirmPasswordView.getText().toString();

        if (TextUtils.isEmpty(fname)) {
            _fnameView.setError(getString(R.string.error_field_required));
            cancel = true;
        }
        if (TextUtils.isEmpty(lname)) {
            _lnameView.setError(getString(R.string.error_field_required));
            cancel = true;
        }
        if (TextUtils.isEmpty(password) || !isPasswordValid(password)) {
            _passwordView.setError(getString(R.string.error_invalid_password));
            cancel = true;
        }
        if (TextUtils.isEmpty(confirm_password) || !password.equals(confirm_password)) {
            _confirmPasswordView.setError(getString(R.string.error_invalid_confirm_password));
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
            String urlParameters = "{\"fname\":\"" + fname + "\",\"lname\":\"" + lname +
                    "\",\"mail\":\"" + email + "\",\"password\":\"" + password + "\"}";
            String response = new HttpUrlConnection(this).execute("signup",
                    urlParameters).get(5, TimeUnit.SECONDS);
            if (Globals.parseResponse(response, "register")) {
                response = new HttpUrlConnection(this).execute("signin",
                    urlParameters).get(5, TimeUnit.SECONDS);
                if (Globals.parseResponse(response, "logged")) {
                    Intent intent = new Intent(RegisterActivity.this, MenuActivity.class);
                    startActivity(intent);
                    finish();
                }
            }
            cancel = true;
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

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        callbackManager.onActivityResult(requestCode, resultCode, data);
        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                Intent returnIntent = new Intent(RegisterActivity.this, MainActivity.class);
				setResult(RESULT_CANCELED, returnIntent);
				finish();
				return true;
        }
        return super.onOptionsItemSelected(item);
    }

}
