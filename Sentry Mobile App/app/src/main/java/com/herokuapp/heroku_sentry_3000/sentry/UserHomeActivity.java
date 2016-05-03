package com.herokuapp.heroku_sentry_3000.sentry;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;


public class UserHomeActivity extends AppCompatActivity {
    Button btnGroups;
    //Button btnMaps;
    Button btnLogout;
    TextView tvUserHomeTitle;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_home);

        btnGroups = (Button) findViewById(R.id.btn_groups);
        btnLogout = (Button) findViewById(R.id.btn_home_logout);
        //btnMaps = (Button) findViewById(R.id.btn_map);
        tvUserHomeTitle = (TextView) findViewById(R.id.tv_user_home_title);

        final SharedPreferences preferences = getSharedPreferences("sentry", MODE_PRIVATE);
        tvUserHomeTitle.setText(preferences.getString("username", null) + "'s Home");

        btnGroups.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                startActivity(new Intent(UserHomeActivity.this, GroupsActivity.class));
            }
        });

       /* btnMaps.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                GroupsActivity.DISPLAY_GROUP_MARKERS = false;
                startActivity(new Intent(UserHomeActivity.this, MapActivity.class));
            }
        });*/
        btnLogout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                if (preferences.contains("username")) {
                    logout();
                    Log.i("Logged out: ", String.valueOf(!preferences.contains("username")));
                    startActivity(new Intent(UserHomeActivity.this, LoginActivity.class));

                } else {
                    Toast.makeText(UserHomeActivity.this, "Error: must be logged in to logout", Toast.LENGTH_SHORT).show();

                }
            }
        });

    }

    //logs the user out by clearing sharedPreferences
    public void logout() {
        final SharedPreferences preferences = getSharedPreferences("sentry", MODE_PRIVATE);
        final SharedPreferences.Editor edit = preferences.edit();
        edit.clear();
        edit.apply();
        Toast.makeText(UserHomeActivity.this, "Successfully Logged Out", Toast.LENGTH_SHORT).show();
    }
}
