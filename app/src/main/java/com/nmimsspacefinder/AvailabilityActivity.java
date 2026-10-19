package com.nmimsspacefinder;

import android.app.DatePickerDialog;
import android.app.TimePickerDialog;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Locale;

public class AvailabilityActivity extends AppCompatActivity {

    // -----------------------------
    // UI ELEMENTS
    // -----------------------------

    private TextView backButton;
    private TextView selectedDate;
    private TextView selectedTime;

    private TextView resultTitle;
    private LinearLayout resultsContainer;

    private Button dateButton;
    private Button timeButton;
    private Button findButton;

    // -----------------------------
    // DATE / TIME
    // -----------------------------

    private Calendar calendar = Calendar.getInstance();

    // -----------------------------
    // BACKEND
    // -----------------------------

    /*
     * Android Emulator:
     *
     * 10.0.2.2 = computer localhost
     *
     * Backend:
     * http://localhost:5000
     */

    private static final String BASE_URL =
            "http://127.0.0.1:5000";


    // =========================================================
    // ACTIVITY START
    // =========================================================

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_availability);

        initializeViews();
        setupListeners();
        setDefaultDateAndTime();
    }


    // =========================================================
    // INITIALIZE VIEWS
    // =========================================================

    private void initializeViews() {

        backButton = findViewById(R.id.backButton);

        selectedDate = findViewById(R.id.selectedDate);
        selectedTime = findViewById(R.id.selectedTime);

        dateButton = findViewById(R.id.dateButton);
        timeButton = findViewById(R.id.timeButton);
        findButton = findViewById(R.id.findButton);

        resultTitle = findViewById(R.id.resultTitle);
        resultsContainer = findViewById(R.id.resultsContainer);
    }


    // =========================================================
    // LISTENERS
    // =========================================================

    private void setupListeners() {

        backButton.setOnClickListener(v -> finish());

        dateButton.setOnClickListener(v -> openDatePicker());

        timeButton.setOnClickListener(v -> openTimePicker());

        findButton.setOnClickListener(v -> checkAvailability());
    }


    // =========================================================
    // DEFAULT DATE AND TIME
    // =========================================================

    private void setDefaultDateAndTime() {

        SimpleDateFormat dateFormat =
                new SimpleDateFormat(
                        "yyyy-MM-dd",
                        Locale.getDefault()
                );

        SimpleDateFormat timeFormat =
                new SimpleDateFormat(
                        "HH:mm",
                        Locale.getDefault()
                );

        selectedDate.setText(
                dateFormat.format(calendar.getTime())
        );

        selectedTime.setText(
                timeFormat.format(calendar.getTime())
        );
    }


    // =========================================================
    // DATE PICKER
    // =========================================================

    private void openDatePicker() {

        DatePickerDialog dialog =
                new DatePickerDialog(
                        this,

                        (view, year, month, dayOfMonth) -> {

                            calendar.set(
                                    year,
                                    month,
                                    dayOfMonth
                            );

                            SimpleDateFormat format =
                                    new SimpleDateFormat(
                                            "yyyy-MM-dd",
                                            Locale.getDefault()
                                    );

                            selectedDate.setText(
                                    format.format(
                                            calendar.getTime()
                                    )
                            );
                        },

                        calendar.get(Calendar.YEAR),
                        calendar.get(Calendar.MONTH),
                        calendar.get(Calendar.DAY_OF_MONTH)
                );

        dialog.show();
    }


    // =========================================================
    // TIME PICKER
    // =========================================================

    private void openTimePicker() {

        TimePickerDialog dialog =
                new TimePickerDialog(
                        this,

                        (view, hourOfDay, minute) -> {

                            String time =
                                    String.format(
                                            Locale.getDefault(),
                                            "%02d:%02d",
                                            hourOfDay,
                                            minute
                                    );

                            selectedTime.setText(time);
                        },

                        calendar.get(Calendar.HOUR_OF_DAY),
                        calendar.get(Calendar.MINUTE),

                        true
                );

        dialog.show();
    }


    // =========================================================
    // CHECK AVAILABILITY
    // =========================================================

    private void checkAvailability() {

        String date =
                selectedDate.getText()
                        .toString()
                        .trim();

        String time =
                selectedTime.getText()
                        .toString()
                        .trim();

        if (date.isEmpty() || time.isEmpty()) {

            Toast.makeText(
                    this,
                    "Select date and time",
                    Toast.LENGTH_SHORT
            ).show();

            return;
        }


        // -----------------------------
        // LOADING STATE
        // -----------------------------

        resultTitle.setText("Checking availability...");

        clearResultCards();

        TextView loadingText =
                createNormalText(
                        "Searching for rooms available at "
                                + time
                                + " on "
                                + date
                                + "..."
                );

        resultsContainer.addView(loadingText);

        findButton.setEnabled(false);
        findButton.setAlpha(0.6f);


        // -----------------------------
        // API URL
        // -----------------------------

        String apiUrl =
                BASE_URL
                        + "/api/availability?date="
                        + date
                        + "&time="
                        + time;


        // -----------------------------
        // NETWORK THREAD
        // -----------------------------

        new Thread(() -> {

            HttpURLConnection connection = null;

            try {

                URL url = new URL(apiUrl);

                connection =
                        (HttpURLConnection)
                                url.openConnection();

                connection.setRequestMethod("GET");

                connection.setConnectTimeout(15000);

                connection.setReadTimeout(15000);

                connection.setRequestProperty(
                        "Accept",
                        "application/json"
                );


                int responseCode =
                        connection.getResponseCode();


                InputStream inputStream;

                if (responseCode >= 200
                        && responseCode < 300) {

                    inputStream =
                            connection.getInputStream();

                } else {

                    inputStream =
                            connection.getErrorStream();
                }


                String response =
                        readResponse(inputStream);


                final int finalResponseCode =
                        responseCode;


                runOnUiThread(() -> {

                    findButton.setEnabled(true);
                    findButton.setAlpha(1.0f);


                    if (finalResponseCode >= 200
                            && finalResponseCode < 300) {

                        displayAvailabilityResults(
                                response
                        );

                    } else {

                        displayError(
                                "Server returned error "
                                        + finalResponseCode
                        );
                    }
                });


            } catch (Exception e) {

                runOnUiThread(() -> {

                    findButton.setEnabled(true);
                    findButton.setAlpha(1.0f);

                    displayConnectionError(
                            e.getMessage()
                    );
                });


            } finally {

                if (connection != null) {
                    connection.disconnect();
                }
            }

        }).start();
    }


    // =========================================================
    // READ SERVER RESPONSE
    // =========================================================

    private String readResponse(
            InputStream inputStream
    ) throws Exception {

        if (inputStream == null) {
            return "";
        }

        BufferedReader reader =
                new BufferedReader(
                        new InputStreamReader(
                                inputStream
                        )
                );

        StringBuilder response =
                new StringBuilder();

        String line;

        while ((line = reader.readLine()) != null) {

            response.append(line);
        }

        reader.close();

        return response.toString();
    }


    // =========================================================
    // DISPLAY AVAILABILITY RESULTS
    // =========================================================

    private void displayAvailabilityResults(
            String response
    ) {

        clearResultCards();

        try {

            JSONObject json =
                    new JSONObject(response);


            boolean success =
                    json.optBoolean(
                            "success",
                            false
                    );


            if (!success) {

                displayError(
                        "No availability information received."
                );

                return;
            }


            int count =
                    json.optInt(
                            "count",
                            0
                    );


            JSONArray data =
                    json.optJSONArray("data");


            resultTitle.setText(
                    "Availability Results"
            );


            TextView countText =
                    createSmallText(
                            count
                                    + " rooms found"
                    );

            resultsContainer.addView(
                    countText
            );


            if (data == null
                    || data.length() == 0) {

                TextView emptyText =
                        createNormalText(
                                "No rooms were found for the selected time."
                        );

                resultsContainer.addView(
                        emptyText
                );

                return;
            }


            // -----------------------------
            // ADD EACH ROOM
            // -----------------------------

            for (int i = 0;
                 i < data.length();
                 i++) {

                JSONObject room =
                        data.getJSONObject(i);

                addRoomCard(room);
            }


        } catch (Exception e) {

            displayError(
                    "Unable to read availability data."
            );
        }
    }


    // =========================================================
    // CREATE ROOM CARD
    // =========================================================

    private void addRoomCard(
            JSONObject room
    ) {

        String roomName =
                room.optString(
                        "roomName",
                        "Unknown Room"
                );


        String type =
                room.optString(
                        "type",
                        "Unknown"
                );


        String status =
                room.optString(
                        "status",
                        "unknown"
                );


        JSONObject location =
                room.optJSONObject(
                        "location"
                );


        String wing = "";
        String floor = "";
        String side = "";


        if (location != null) {

            wing =
                    location.optString(
                            "wing",
                            ""
                    );

            floor =
                    location.optString(
                            "floor",
                            ""
                    );

            side =
                    location.optString(
                            "side",
                            ""
                    );
        }


        String locationText =
                buildLocationText(
                        wing,
                        floor,
                        side
                );


        // =====================================================
        // CARD
        // =====================================================

        LinearLayout card =
                new LinearLayout(this);

        card.setOrientation(
                LinearLayout.VERTICAL
        );


        card.setPadding(
                dp(16),
                dp(15),
                dp(16),
                dp(15)
        );


        // IMPORTANT:
        // No R.drawable.bg_room_card here.
        // This prevents drawable resource compilation problems.

        card.setBackground(
                createCardBackground()
        );


        LinearLayout.LayoutParams
                cardParams =
                new LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.MATCH_PARENT,
                        LinearLayout.LayoutParams.WRAP_CONTENT
                );


        cardParams.setMargins(
                0,
                dp(10),
                0,
                0
        );


        card.setLayoutParams(
                cardParams
        );


        // =====================================================
        // ROOM NAME
        // =====================================================

        TextView nameText =
                new TextView(this);

        nameText.setText(
                roomName
        );

        nameText.setTextColor(
                Color.rgb(
                        41,
                        40,
                        33
                )
        );

        nameText.setTextSize(18);

        nameText.setTypeface(
                Typeface.DEFAULT,
                Typeface.BOLD
        );

        card.addView(
                nameText
        );


        // =====================================================
        // TYPE
        // =====================================================

        TextView typeText =
                new TextView(this);

        typeText.setText(
                capitalize(type)
        );

        typeText.setTextColor(
                Color.rgb(
                        105,
                        100,
                        91
                )
        );

        typeText.setTextSize(13);


        LinearLayout.LayoutParams
                typeParams =
                new LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.WRAP_CONTENT,
                        LinearLayout.LayoutParams.WRAP_CONTENT
                );


        typeParams.setMargins(
                0,
                dp(5),
                0,
                0
        );


        typeText.setLayoutParams(
                typeParams
        );


        card.addView(
                typeText
        );


        // =====================================================
        // LOCATION
        // =====================================================

        TextView locationTextView =
                new TextView(this);

        locationTextView.setText(
                locationText
        );

        locationTextView.setTextColor(
                Color.rgb(
                        75,
                        73,
                        68
                )
        );

        locationTextView.setTextSize(13);


        LinearLayout.LayoutParams
                locationParams =
                new LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.WRAP_CONTENT,
                        LinearLayout.LayoutParams.WRAP_CONTENT
                );


        locationParams.setMargins(
                0,
                dp(10),
                0,
                0
        );


        locationTextView.setLayoutParams(
                locationParams
        );


        card.addView(
                locationTextView
        );


        // =====================================================
        // STATUS
        // =====================================================

        TextView statusText =
                new TextView(this);


        String displayStatus =
                getDisplayStatus(status);


        statusText.setText(
                getStatusSymbol(status)
                        + "  "
                        + displayStatus
        );


        statusText.setTextSize(12);


        statusText.setTypeface(
                Typeface.DEFAULT,
                Typeface.BOLD
        );


        statusText.setGravity(
                Gravity.CENTER
        );


        statusText.setPadding(
                dp(12),
                dp(7),
                dp(12),
                dp(7)
        );


        LinearLayout.LayoutParams
                statusParams =
                new LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.WRAP_CONTENT,
                        LinearLayout.LayoutParams.WRAP_CONTENT
                );


        statusParams.setMargins(
                0,
                dp(12),
                0,
                0
        );


        statusText.setLayoutParams(
                statusParams
        );


        // IMPORTANT:
        // Status background is created in Java.
        // No bg_status_available.xml etc. required.

        applyStatusStyle(
                statusText,
                status
        );


        card.addView(
                statusText
        );


        resultsContainer.addView(
                card
        );
    }


    // =========================================================
    // CARD BACKGROUND
    // =========================================================

    private GradientDrawable createCardBackground() {

        GradientDrawable background =
                new GradientDrawable();

        background.setColor(
                Color.WHITE
        );

        background.setCornerRadius(
                dp(16)
        );

        background.setStroke(
                dp(1),
                Color.rgb(
                        225,
                        220,
                        210
                )
        );

        return background;
    }


    // =========================================================
    // STATUS STYLE
    // =========================================================

    private void applyStatusStyle(
            TextView statusText,
            String status
    ) {

        String value =
                status == null
                        ? "unknown"
                        : status.toLowerCase(
                                Locale.getDefault()
                        );


        GradientDrawable background =
                new GradientDrawable();


        background.setCornerRadius(
                dp(30)
        );


        if (value.equals("available")) {

            // Green

            statusText.setTextColor(
                    Color.rgb(
                            40,
                            105,
                            70
                    )
            );

            background.setColor(
                    Color.rgb(
                            232,
                            246,
                            237
                    )
            );


        } else if (value.equals("occupied")) {

            // Red

            statusText.setTextColor(
                    Color.rgb(
                            150,
                            60,
                            50
                    )
            );

            background.setColor(
                    Color.rgb(
                            252,
                            235,
                            232
                    )
            );


        } else if (
                value.equals("no class scheduled")
                        || value.equals("no_class_scheduled")
                        || value.equals("no-class-scheduled")
        ) {

            // Orange / neutral

            statusText.setTextColor(
                    Color.rgb(
                            130,
                            90,
                            40
                    )
            );

            background.setColor(
                    Color.rgb(
                            250,
                            242,
                            225
                    )
            );


        } else {

            // Unknown

            statusText.setTextColor(
                    Color.rgb(
                            100,
                            90,
                            70
                    )
            );

            background.setColor(
                    Color.rgb(
                            243,
                            238,
                            228
                    )
            );
        }


        statusText.setBackground(
                background
        );
    }


    // =========================================================
    // STATUS TEXT
    // =========================================================

    private String getDisplayStatus(
            String status
    ) {

        if (status == null
                || status.trim().isEmpty()) {

            return "UNKNOWN";
        }


        String value =
                status.trim()
                        .toLowerCase(
                                Locale.getDefault()
                        );


        if (value.equals("available")) {
            return "AVAILABLE";
        }


        if (value.equals("occupied")) {
            return "OCCUPIED";
        }


        if (value.equals("no class scheduled")
                || value.equals("no_class_scheduled")
                || value.equals("no-class-scheduled")) {

            return "NO CLASS SCHEDULED";
        }


        return value
                .toUpperCase(
                        Locale.getDefault()
                );
    }


    // =========================================================
    // STATUS SYMBOL
    // =========================================================

    private String getStatusSymbol(
            String status
    ) {

        if (status == null) {
            return "?";
        }


        String value =
                status.toLowerCase(
                        Locale.getDefault()
                );


        if (value.equals("available")) {

            return "✓";
        }


        if (value.equals("occupied")) {

            return "!";
        }


        if (value.contains("no class")) {

            return "–";
        }


        return "?";
    }


    // =========================================================
    // LOCATION TEXT
    // =========================================================

    private String buildLocationText(
            String wing,
            String floor,
            String side
    ) {

        StringBuilder location =
                new StringBuilder();


        if (wing != null
                && !wing.isEmpty()) {

            location.append(
                    wing
            );

            location.append(
                    " Wing"
            );
        }


        if (floor != null
                && !floor.isEmpty()) {

            if (location.length() > 0) {

                location.append(
                        " · "
                );
            }

            location.append(
                    floor
            );

            location.append(
                    " Floor"
            );
        }


        if (side != null
                && !side.isEmpty()) {

            if (location.length() > 0) {

                location.append(
                        " · "
                );
            }

            location.append(
                    side
            );
        }


        if (location.length() == 0) {

            return "Location unavailable";
        }


        return location.toString();
    }


    // =========================================================
    // CONNECTION ERROR
    // =========================================================

    private void displayConnectionError(
            String message
    ) {

        clearResultCards();


        resultTitle.setText(
                "Availability Results"
        );


        TextView errorText =
                createErrorText();


        LinearLayout errorBox =
                createErrorBox();


        errorBox.addView(
                errorText
        );


        resultsContainer.addView(
                errorBox
        );
    }


    // =========================================================
    // NORMAL ERROR
    // =========================================================

    private void displayError(
            String message
    ) {

        clearResultCards();


        resultTitle.setText(
                "Availability Results"
        );


        TextView errorText =
                createNormalText(
                        message
                );


        resultsContainer.addView(
                errorText
        );
    }


    // =========================================================
    // CONNECTION ERROR BOX
    // =========================================================

    private LinearLayout createErrorBox() {

        LinearLayout box =
                new LinearLayout(this);

        box.setOrientation(
                LinearLayout.VERTICAL
        );


        box.setPadding(
                dp(16),
                dp(15),
                dp(16),
                dp(15)
        );


        GradientDrawable background =
                new GradientDrawable();

        background.setColor(
                Color.WHITE
        );

        background.setCornerRadius(
                dp(16)
        );

        background.setStroke(
                dp(1),
                Color.rgb(
                        225,
                        215,
                        200
                )
        );


        box.setBackground(
                background
        );


        LinearLayout.LayoutParams
                params =
                new LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.MATCH_PARENT,
                        LinearLayout.LayoutParams.WRAP_CONTENT
                );


        params.setMargins(
                0,
                dp(10),
                0,
                dp(10)
        );


        box.setLayoutParams(
                params
        );


        return box;
    }


    // =========================================================
    // ERROR TEXT
    // =========================================================

    private TextView createErrorText() {

        TextView textView =
                new TextView(this);


        textView.setText(
                "Unable to connect to the backend.\n\n"
                        + "Server: "
                        + BASE_URL
                        + "\n\n"
                        + "Make sure the backend is running."
        );


        textView.setTextColor(
                Color.rgb(
                        70,
                        68,
                        62
                )
        );


        textView.setTextSize(13);


        textView.setLineSpacing(
                0,
                1.15f
        );


        return textView;
    }


    // =========================================================
    // CLEAR OLD RESULTS
    // =========================================================

    private void clearResultCards() {

        /*
         * resultTitle is the first child.
         *
         * Remove everything after it.
         */

        while (
                resultsContainer.getChildCount() > 1
        ) {

            resultsContainer.removeViewAt(1);
        }
    }


    // =========================================================
    // NORMAL TEXT
    // =========================================================

    private TextView createNormalText(
            String text
    ) {

        TextView textView =
                new TextView(this);


        textView.setText(
                text
        );


        textView.setTextColor(
                Color.rgb(
                        70,
                        68,
                        62
                )
        );


        textView.setTextSize(14);


        textView.setLineSpacing(
                0,
                1.15f
        );


        textView.setPadding(
                dp(12),
                dp(12),
                dp(12),
                dp(12)
        );


        LinearLayout.LayoutParams
                params =
                new LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.MATCH_PARENT,
                        LinearLayout.LayoutParams.WRAP_CONTENT
                );


        params.setMargins(
                0,
                dp(8),
                0,
                0
        );


        textView.setLayoutParams(
                params
        );


        return textView;
    }


    // =========================================================
    // SMALL TEXT
    // =========================================================

    private TextView createSmallText(
            String text
    ) {

        TextView textView =
                new TextView(this);


        textView.setText(
                text
        );


        textView.setTextColor(
                Color.rgb(
                        105,
                        100,
                        91
                )
        );


        textView.setTextSize(12);


        textView.setPadding(
                0,
                dp(4),
                0,
                dp(4)
        );


        return textView;
    }


    // =========================================================
    // CAPITALIZE
    // =========================================================

    private String capitalize(
            String value
    ) {

        if (value == null
                || value.isEmpty()) {

            return "";
        }


        return value.substring(
                0,
                1
        ).toUpperCase(
                Locale.getDefault()
        )
                + value.substring(1);
    }


    // =========================================================
    // DP CONVERSION
    // =========================================================

    private int dp(
            int value
    ) {

        return (int) (
                value
                        * getResources()
                        .getDisplayMetrics()
                        .density
        );
    }
}
