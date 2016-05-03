package com.herokuapp.heroku_sentry_3000.sentry;

import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.DefaultRetryPolicy;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.RetryPolicy;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class LoginActivity extends AppCompatActivity {
    private static final String TAG = "PostActivity";
    private static final String PREFS_NAME = "sentry";

    //public static final String SERVER_URL = "http://10.0.2.2:3000/";
    public static final String SERVER_URL = "http://heroku-sentry-3000.herokuapp.com/";
    public static final String POST_FILE = "true";
    public static final String POST_URL = SERVER_URL + "authenticate";
    public static final String GROUPS_URL = SERVER_URL + "groups";
    public static final String USER_GROUPS_URL = GROUPS_URL + "/users/";
    public static final String GROUP_MARKERS_URL = SERVER_URL + "map/";

    private static final String POST_OPTION_APPID = "appid";
    private static final String POST_OPTION_ITEMID = "itemid";
    private static final String POST_OPTION_DATA = "data";

    public static final String APP_ID = "post_test";
    public static final String ITEM_ID = "25";
    public SharedPreferences sharedPreferences;
    EditText etUsername;
    EditText etPassword;

    Button btnLogin;
    Button btnLogout;
    TextView tvMessage;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        tvMessage = (TextView) findViewById(R.id.tv_message);
        btnLogin = (Button) findViewById(R.id.btn_login);
        etPassword = (EditText) findViewById(R.id.et_password);
        etUsername = (EditText) findViewById(R.id.et_username);
        btnLogout = (Button) findViewById(R.id.btn_logout);

        sharedPreferences = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        btnLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                final String username = etUsername.getText().toString();
                final String password = etPassword.getText().toString();
                login(username, password);
            }
        });

        btnLogout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (sharedPreferences.contains("username")) {
                    logout();
                    tvMessage.setText("");
                    Log.i("Logged out: ", String.valueOf(!sharedPreferences.contains("username")));

                } else {
                    customToast("Error: must be logged in to logout");
                    //Toast.makeText(LoginActivity.this, "Error: must be logged in to logout", Toast.LENGTH_SHORT).show();
                    tvMessage.setText(R.string.tv_message_logout_error);
                }


            }
        });
    }

    public void customToast(String message){
        Toast toast = Toast.makeText(LoginActivity.this, message, Toast.LENGTH_SHORT);
        View view = toast.getView();
        //To change the Background of Toast
        view.setBackgroundColor(Color.TRANSPARENT);
        toast.show();
    }
    //attempt to login user
    public void login(String username, String password) {
        // RequestQueue queue = Volley.newRequestQueue(this);

        String cachedUsername = sharedPreferences.getString("username", null);
        if (cachedUsername != null) {
            final SharedPreferences.Editor edit = sharedPreferences.edit();
            edit.clear();
            edit.apply();
            Log.i("username: ", cachedUsername);
            String data = "success";
        }
            postRequest(username, password);
    }

    //logs the user out by clearing sharedPreferences
    public void logout() {
        final SharedPreferences.Editor edit = sharedPreferences.edit();
        edit.clear();
        edit.apply();
        Toast.makeText(LoginActivity.this, "Successfully Logged Out", Toast.LENGTH_SHORT).show();
    }


    //updates the TextView after a login attempt is made and switches views if the attempt is successful
    public void onLoginAttempt(boolean isValid) {

        if (isValid) {
            tvMessage.setText("");
            //Toast.makeText(LoginActivity.this, "Successfully Logged In", Toast.LENGTH_SHORT).show();
            customToast("Successfully Logged In");
            startActivity(new Intent(LoginActivity.this, UserHomeActivity.class));
        } else {
           //Toast.makeText(LoginActivity.this, "Error: Invalid Login", Toast.LENGTH_SHORT).show();
            customToast("Error: Invalid Login");
            tvMessage.setText(R.string.tv_message_invalid_login_error);
        }
    }


    //post authentication request and stores user info in sharedPreferences
    public void postRequest(final String username, String password) {

        Log.i(TAG, "postRequest");

        final SharedPreferences.Editor editor = sharedPreferences.edit();
        RequestQueue queue = Volley.newRequestQueue(this);
        Map<String, String> jsonParams = new HashMap<>();


        jsonParams.put("username", username);
        jsonParams.put("password", password);

        JsonObjectRequest postRequest = new JsonObjectRequest(
                Request.Method.POST, POST_URL, new JSONObject(jsonParams),
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {

                            Log.i(TAG, response.getString("status"));


                            if (Objects.equals(response.getString("status"), "true")) {
                                Log.i(TAG, "success");
                                JSONArray responseArray = response.getJSONArray("results");
                                ArrayList<String> userInfo = new ArrayList<>();

                                JSONObject responseObjectInArray = responseArray.getJSONObject(0);
                                userInfo.add(responseObjectInArray.getString("user_id"));
                                userInfo.add(responseObjectInArray.getString("apikey"));

                                Log.i(String.valueOf(0), responseObjectInArray.getString("user_id"));
                                Log.i(String.valueOf(0), responseObjectInArray.getString("apikey"));
                                editor.putString("username", username);
                                editor.putString("user_id", userInfo.get(0));
                                editor.putString("apikey", userInfo.get(1));
                                editor.apply();
                                onLoginAttempt(true);
                            } else {
                                onLoginAttempt(false);
                                editor.clear();
                                editor.apply();
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }


                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.i(TAG, "error is: " + error.toString());
                    }
                }) {
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                HashMap<String, String> headers = new HashMap<String, String>();
                headers.put("Content-Type", "application/json; charset=utf-8");
                headers.put("User-agent", System.getProperty("http.agent"));
                return headers;
            }

           /* @Override
            protected Map<String, String> getParams() {
                Map<String, String> params = new HashMap<String, String>();
                params.put("user", "YOUR USERNAME");
                params.put("pass", "YOUR PASSWORD");
                return params;
            }*/
        };
        int socketTimeout = 10000;//30 seconds - change to what you want
        RetryPolicy policy = new DefaultRetryPolicy(socketTimeout, DefaultRetryPolicy.DEFAULT_MAX_RETRIES,
                DefaultRetryPolicy.DEFAULT_BACKOFF_MULT);
        postRequest.setRetryPolicy(policy);
        queue.add(postRequest);

    }


}

