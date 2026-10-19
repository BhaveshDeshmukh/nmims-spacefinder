package com.nmimsspacefinder;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class RoomDetailsActivity extends AppCompatActivity {

    TextView backButton;
    TextView roomName;
    TextView roomType;
    TextView roomLocation;

    Button availabilityButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_room_details);

        backButton = findViewById(R.id.backButton);
        roomName = findViewById(R.id.roomName);
        roomType = findViewById(R.id.roomType);
        roomLocation = findViewById(R.id.roomLocation);
        availabilityButton = findViewById(R.id.checkAvailabilityButton);

        backButton.setOnClickListener(v -> finish());

        String name =
                getIntent().getStringExtra("ROOM_NAME");

        String type =
                getIntent().getStringExtra("ROOM_TYPE");

        String location =
                getIntent().getStringExtra("ROOM_LOCATION");

        roomName.setText(name);
        roomType.setText(type);
        roomLocation.setText(location);

        availabilityButton.setOnClickListener(v -> {

            Intent intent = new Intent(
                    RoomDetailsActivity.this,
                    AvailabilityActivity.class
            );

            intent.putExtra("ROOM_NAME", name);

            startActivity(intent);
        });
    }
}