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

public class RegisterActivity extends AppCompatActivity implements OnClickListener {

    private EditText _fnameView;
    private EditText _lnameView;
    private EditText _emailView;
    private EditText _passwordView;
    private EditText _confirmPasswordView;
    Button _signUp = null;

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

        _signUp.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.sign_up && !attemptLogin()) {
            Intent intent = new Intent(RegisterActivity.this, MenuActivity.class);
            setResult(RESULT_CANCELED, intent);
            finish();
        }
    }

    private boolean attemptLogin() {
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
        // TODO Call database see if email & password are correct and not already taken
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
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                Intent returnIntent = new Intent(RegisterActivity.this, MenuActivity.class);
				setResult(RESULT_CANCELED, returnIntent);
				finish();
				return true;
        }
        return super.onOptionsItemSelected(item);
    }

}
