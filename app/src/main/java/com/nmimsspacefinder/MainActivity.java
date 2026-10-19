package com.nmimsspacefinder;

import android.content.Intent;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    EditText searchInput;

    LinearLayout classroomsButton;
    LinearLayout labsButton;
    LinearLayout availabilityButton;
    LinearLayout facilitiesButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_main);

        searchInput = findViewById(R.id.searchInput);

        classroomsButton = findViewById(R.id.classroomsButton);
        labsButton = findViewById(R.id.labsButton);
        availabilityButton = findViewById(R.id.availabilityButton);
        facilitiesButton = findViewById(R.id.facilitiesButton);

        // Open classroom directory
        classroomsButton.setOnClickListener(v -> {

            Intent intent = new Intent(
                    MainActivity.this,
                    SpaceDirectoryActivity.class
            );

            intent.putExtra("TYPE", "CLASSROOM");

            startActivity(intent);
        });

        // Open laboratory directory
        labsButton.setOnClickListener(v -> {

            Intent intent = new Intent(
                    MainActivity.this,
                    SpaceDirectoryActivity.class
            );

            intent.putExtra("TYPE", "LAB");

            startActivity(intent);
        });

        // Open availability screen
        availabilityButton.setOnClickListener(v -> {

            Intent intent = new Intent(
                    MainActivity.this,
                    AvailabilityActivity.class
            );

            startActivity(intent);
        });

        // Facilities - simple message for now
        facilitiesButton.setOnClickListener(v -> {

            Toast.makeText(
                    this,
                    "Campus facilities will be added later",
                    Toast.LENGTH_SHORT
            ).show();
        });

        // Home search
        searchInput.setOnEditorActionListener((v, actionId, event) -> {

            boolean enterPressed =
                    event != null
                            && event.getKeyCode() == KeyEvent.KEYCODE_ENTER
                            && event.getAction() == KeyEvent.ACTION_DOWN;

            if (actionId == EditorInfo.IME_ACTION_SEARCH
                    || enterPressed) {

                String query =
                        searchInput.getText().toString().trim();

                if (query.isEmpty()) {

                    searchInput.setError("Enter a room name");

                } else {

                    Intent intent = new Intent(
                            MainActivity.this,
                            SpaceDirectoryActivity.class
                    );

                    intent.putExtra("TYPE", "SEARCH");
                    intent.putExtra("QUERY", query);

                    startActivity(intent);
                }

                return true;
            }

            return false;
        });
    }
}