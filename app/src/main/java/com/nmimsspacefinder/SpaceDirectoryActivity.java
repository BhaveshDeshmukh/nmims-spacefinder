package com.nmimsspacefinder;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import java.util.ArrayList;
import java.util.List;

public class SpaceDirectoryActivity extends AppCompatActivity {

    EditText searchInput;
    LinearLayout roomsContainer;
    TextView titleText;
    TextView subtitleText;
    TextView backButton;

    List<Room> rooms = new ArrayList<>();

    boolean isLab = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_space_directory);

        searchInput = findViewById(R.id.directorySearch);
        roomsContainer = findViewById(R.id.roomsContainer);
        titleText = findViewById(R.id.directoryTitle);
        subtitleText = findViewById(R.id.directorySubtitle);
        backButton = findViewById(R.id.backButton);

        String type = getIntent().getStringExtra("TYPE");
        String query = getIntent().getStringExtra("QUERY");

        if ("LAB".equals(type)) {
            isLab = true;
        }

        backButton.setOnClickListener(v -> finish());

        loadRooms();

        // If opened from home search
        if ("SEARCH".equals(type) && query != null) {

            titleText.setText("Search Results");
            subtitleText.setText("Rooms matching your search");

            searchInput.setText(query);

            searchRooms(query);

        } else {

            showRooms(rooms);
        }

        searchInput.addTextChangedListener(new TextWatcher() {

            @Override
            public void beforeTextChanged(
                    CharSequence s,
                    int start,
                    int count,
                    int after) {
            }

            @Override
            public void onTextChanged(
                    CharSequence s,
                    int start,
                    int before,
                    int count) {

                searchRooms(s.toString());
            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });
    }

    private void loadRooms() {

        rooms.clear();

        if (isLab) {

            titleText.setText("Laboratories");
            subtitleText.setText("Find your laboratory");

            rooms.add(new Room(
                    "CN Lab",
                    "Laboratory",
                    "B Wing · 2nd Floor · Left Side"
            ));

            rooms.add(new Room(
                    "Programming Lab (PL)-1",
                    "Laboratory",
                    "B Wing · 1st Floor · Right Side"
            ));

            rooms.add(new Room(
                    "CC-1",
                    "Laboratory",
                    "B Wing · 1st Floor · Left Side"
            ));

        } else {

            titleText.setText("Classrooms");
            subtitleText.setText("Find your lecture room");

            rooms.add(new Room(
                    "LR 1",
                    "Classroom",
                    "B Wing · Ground Floor · Left Side"
            ));

            rooms.add(new Room(
                    "LR 3",
                    "Classroom",
                    "B Wing · Ground Floor · Right Side"
            ));

            rooms.add(new Room(
                    "LR 10",
                    "Classroom",
                    "B Wing · 2nd Floor · Right Side"
            ));

            rooms.add(new Room(
                    "LR 17",
                    "Classroom",
                    "C Wing · 1st Floor · Right Side"
            ));

            rooms.add(new Room(
                    "LR 13",
                    "Classroom",
                    "C Wing · 1st Floor · Left Side"
            ));

            rooms.add(new Room(
                    "LR 22",
                    "Classroom",
                    "D Wing · Ground Floor · Right Side"
            ));
        }
    }

    private void searchRooms(String text) {

        String query = text.toLowerCase().trim();

        if (query.isEmpty()) {

            showRooms(rooms);
            return;
        }

        List<Room> result = new ArrayList<>();

        for (Room room : rooms) {

            if (room.name.toLowerCase().contains(query)
                    || room.location.toLowerCase().contains(query)) {

                result.add(room);
            }
        }

        showRooms(result);
    }

    private void showRooms(List<Room> roomList) {

        roomsContainer.removeAllViews();

        if (roomList.isEmpty()) {

            TextView message = new TextView(this);

            message.setText("No matching spaces found");
            message.setTextColor(0xFF77746C);
            message.setTextSize(15);
            message.setGravity(17);
            message.setPadding(0, 40, 0, 40);

            roomsContainer.addView(message);

            return;
        }

        for (Room room : roomList) {

            View card = getLayoutInflater().inflate(
                    R.layout.item_room,
                    roomsContainer,
                    false
            );

            TextView roomName =
                    card.findViewById(R.id.roomName);

            TextView roomType =
                    card.findViewById(R.id.roomType);

            TextView roomLocation =
                    card.findViewById(R.id.roomLocation);

            roomName.setText(room.name);
            roomType.setText(room.type);
            roomLocation.setText(room.location);

            card.setOnClickListener(v -> {

                Intent intent = new Intent(
                        SpaceDirectoryActivity.this,
                        RoomDetailsActivity.class
                );

                intent.putExtra(
                        "ROOM_NAME",
                        room.name
                );

                intent.putExtra(
                        "ROOM_TYPE",
                        room.type
                );

                intent.putExtra(
                        "ROOM_LOCATION",
                        room.location
                );

                startActivity(intent);
            });

            roomsContainer.addView(card);
        }
    }

    static class Room {

        String name;
        String type;
        String location;

        Room(
                String name,
                String type,
                String location) {

            this.name = name;
            this.type = type;
            this.location = location;
        }
    }
}