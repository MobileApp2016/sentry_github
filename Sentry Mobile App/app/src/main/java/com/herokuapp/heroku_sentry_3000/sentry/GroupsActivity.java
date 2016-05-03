package com.herokuapp.heroku_sentry_3000.sentry;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.design.widget.TabLayout;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListAdapter;
import android.widget.ListView;
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

public class GroupsActivity extends AppCompatActivity {
    Button btnPopulateGroups;
    ListView lvGroups;
    TextView tvTitle;
    public static boolean DISPLAY_GROUP_MARKERS = false;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_groups);
        btnPopulateGroups = (Button) findViewById(R.id.btn_populate_groups);
        lvGroups = (ListView) findViewById(R.id.lv_groups);
        tvTitle = (TextView) findViewById(R.id.tv_groups_title);

        final SharedPreferences preferences = getSharedPreferences("sentry", MODE_PRIVATE);

        tvTitle.setText(preferences.getString("username",null) + "'s Groups");

        btnPopulateGroups.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                getGroups();
            }
        });

        lvGroups.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                TextView tvClickedItem = (TextView) view.findViewById(R.id.tv_list_view_group_name);
                String groupName = tvClickedItem.getText().toString();
                Log.i("Group Name ", groupName);
                Intent intent =new Intent(GroupsActivity.this, MapActivity.class);
                intent.putExtra("group_name", groupName);
//                startActivity(new Intent(GroupsActivity.this, MapActivity.class));
                DISPLAY_GROUP_MARKERS = true;
                startActivity(intent);

            }

        });
    }

   /* public void getGroups() {
        RequestQueue queue = Volley.newRequestQueue(this);
        final SharedPreferences preferences = getSharedPreferences("sentry", MODE_PRIVATE);
        String t = preferences.getString("username", null);
        String userID = preferences.getString("user_id", null);
        Log.i("username", t);
        Log.i("user_id", userID);
        String req = null;

        final String url = LoginActivity.USER_GROUPS_URL + userID;
        final String test = "test";

        final JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.GET, url, (String) null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            JSONArray responseArray = response.getJSONArray("results");
                            ArrayList<String> groupsList = new ArrayList<>();
                            Log.i("onResponse", String.valueOf(responseArray.length()));

                            // Log.i("get request:  ", responseObjectInArray.getString("group_name"));
                            //Gets the groupNames from the response array and stores them in a list
                            for (int i = 0; i < responseArray.length(); i++) {

                                JSONObject responseObjectInArray = responseArray.getJSONObject(i);
                                groupsList.add(responseObjectInArray.getString("group_name"));
                                Log.i(String.valueOf(i), responseObjectInArray.getString("group_name"));
                            }
                            populateListView(groupsList);

                            //  Log.i("get request", response.getJSONArray("results").getJSONObject(0).optString("group_id"));
                        } catch (JSONException e) {
                            Toast.makeText(getApplicationContext(),
                                    "Error: " + e.getMessage(),
                                    Toast.LENGTH_LONG).show();
                            e.printStackTrace();
                        }
                        // Toast.makeText(LoginActivity.this, response.toString(), Toast.LENGTH_SHORT).show();
                    }

                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.i("Get Error for: ", error.toString());
                    }
                }) {
            @Override
            protected Map<String, String> getParams() {
                Map<String, String> params = new HashMap<>();
                params.put("user", "YOUR USERNAME");
                params.put("pass", "YOUR PASSWORD");
                return params;
            }

            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String> params = new HashMap<String, String>();
                params.put("Content-Type", "application/x-www-form-urlencoded");
                return params;
            }
        };
        //add request to queue
        queue.add(jsonObjectRequest);


    }
*/
    public void getGroups() {
        Log.i("PostRequest", "TRUE");
        RequestQueue queue = Volley.newRequestQueue(this);
        Map<String, String> jsonParams = new HashMap<>();

        final SharedPreferences preferences = getSharedPreferences("sentry", MODE_PRIVATE);
        final SharedPreferences.Editor edit = preferences.edit();

//        String t = preferences.getString("username", null);
        String userID = preferences.getString("user_id", null);
//        Log.i("username", t);
        Log.i("user_id", userID);
        String req = null;

        final String url = LoginActivity.USER_GROUPS_URL + userID;
        final String test = "test";
        //jsonParams.put("userid", userID);

        JsonObjectRequest postRequest = new JsonObjectRequest(
                Request.Method.POST, url, new JSONObject(jsonParams),
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {


                         /*   JSONArray responseArray = response.getJSONArray("results");
                            ArrayList<String> userInfo = new ArrayList<>();

                            JSONObject responseObjectInArray = responseArray.getJSONObject(0);
                            userInfo.add(responseObjectInArray.getString("user_id"));
                            userInfo.add(responseObjectInArray.getString("apikey"));

                            Log.i(String.valueOf(0), responseObjectInArray.getString("user_id"));
                            Log.i(String.valueOf(0), responseObjectInArray.getString("apikey"));
                        */

                            if (Objects.equals(response.getString("status"), "OK")) {
                                JSONArray responseArray = response.getJSONArray("results");
                                ArrayList<String> groupsList = new ArrayList<>();
                                Log.i("onResponse", String.valueOf(responseArray.length()));

                                // Log.i("get request:  ", responseObjectInArray.getString("group_name"));
                                //Gets the groupNames from the response array and stores them in a list
                                for (int i = 0; i < responseArray.length(); i++) {
                                    JSONObject responseObjectInArray = responseArray.getJSONObject(i);
                                    edit.putString(responseObjectInArray.getString("group_name"),
                                            responseObjectInArray.getString("group_id"));
                                    groupsList.add(responseObjectInArray.getString("group_name"));
                                    Log.i(String.valueOf(i), responseObjectInArray.getString("group_name"));
                                    Log.i(String.valueOf(i), responseObjectInArray.getString("group_id"));
                                }
                                edit.apply();
                                populateListView(groupsList);
                            } else {
                                Toast.makeText(GroupsActivity.this, "No groups found", Toast.LENGTH_SHORT).show();
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }


                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.i("POST", "error is: " + error.toString());
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


    public void populateListView(ArrayList<String> groupsList) {
        ArrayAdapter<String> arrayAdapter = new ArrayAdapter<>(this, R.layout.list_view_groups, groupsList);

        lvGroups.setAdapter(arrayAdapter);


    }

}
