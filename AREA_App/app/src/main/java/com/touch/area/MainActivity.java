package com.touch.area;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import org.xml.sax.InputSource;
import org.xml.sax.XMLReader;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

public class MainActivity extends AppCompatActivity implements OnClickListener {

    private EditText _emailView;
    private EditText _passwordView;
    Button _signIn = null;
    Button _register = null;
    Button _facebook = null;
    Button _office = null;
    TextView _forgotPassword = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        _emailView = (EditText) findViewById(R.id.email);
        _passwordView = (EditText) findViewById(R.id.password);

        _signIn = (Button) findViewById(R.id.sign_in);
        _register = (Button) findViewById(R.id.register);
        _facebook = (Button) findViewById(R.id.facebook);
        _office = (Button) findViewById(R.id.office);
        _forgotPassword = (TextView) findViewById(R.id.forgot_password);

        _signIn.setOnClickListener(this);
        _register.setOnClickListener(this);
        _facebook.setOnClickListener(this);
        _office.setOnClickListener(this);
        _forgotPassword.setOnClickListener(this);
    }

    @Override
	public void onClick(View view) {
		// TODO Auto-generated method stub.
		switch (view.getId()) {
            case R.id.sign_in:
            {
                if (!attemptLogin()) {
                    Intent intent = new Intent(MainActivity.this, MenuActivity.class);
                    startActivity(intent);
                    break;
                }
                break;
            }
            case R.id.register:
            {
                Intent intent = new Intent(MainActivity.this, RegisterActivity.class);
                startActivity(intent);
                break;
            }
            case R.id.facebook:
            {
            }
            case R.id.office:
            {
            }
            case R.id.forgot_password:
            {
            }
        }
    }

    private boolean attemptLogin() {
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
        // TODO Call database see if email & password are correct
        if (!cancel) {
            String urlParameters = "javascript { mail : " + email + ", password : " + password + " }";
            String response = executePost("http://10.41.168.179:8080/api/signin/",
                    urlParameters);
            Log.e("URL REQUEST", response);
        }
        return cancel;
    }

    public static String executePost(String targetURL, String urlParameters) {
        HttpURLConnection connection = null;

        try {
            //Create connection
            URL url = new URL(targetURL);
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type",
                    "application/x-www-form-urlencoded");
            connection.setRequestProperty("charset", "utf-8");


            connection.setRequestProperty("Content-Length",
                    Integer.toString(urlParameters.getBytes().length));
            connection.setRequestProperty("Content-Language", "en-US");

            connection.setUseCaches (false);
            connection.setDoOutput(true);

            //Send request
            Log.e("MESSAGE", urlParameters);
            DataOutputStream wr = new DataOutputStream (
                    connection.getOutputStream());
            wr.writeBytes(urlParameters);
            wr.close();
            Log.e("REQUEST", "POST");

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
            Log.e("RESQUEST", "RESPONSE");
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

    private boolean isEmailValid(String email) {
        if (email.length() < 7 || !email.contains("@"))
            return false;
        return true;
    }

    private boolean isPasswordValid(String password) {
        return password.length() > 4;
    }

    class HTTPRequest extends AsyncTask<URL, String> {

        private Exception exception;

        protected RSSFeed doInBackground(String... urls) {
            try {
                URL url = new URL(urls[0]);
                SAXParserFactory factory = SAXParserFactory.newInstance();
                SAXParser parser = factory.newSAXParser();
                XMLReader xmlreader = parser.getXMLReader();
                RssHandler theRSSHandler = new RssHandler();
                xmlreader.setContentHandler(theRSSHandler);
                InputSource is = new InputSource(url.openStream());
                xmlreader.parse(is);

                return theRSSHandler.getFeed();
            } catch (Exception e) {
                this.exception = e;

                return null;
            } finally {
                is.close();
            }
        }

        protected void onPostExecute(RSSFeed feed) {
            // TODO: check this.exception
            // TODO: do something with the feed
        }
    }
}
