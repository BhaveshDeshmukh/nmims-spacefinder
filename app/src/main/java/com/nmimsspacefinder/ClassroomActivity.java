package com.nmimsspacefinder;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.graphics.Typeface;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class ClassroomActivity extends AppCompatActivity {

    private final int backgroundColor = 0xFFF8F6F1;
    private final int cardColor = 0xFFFFFFFF;
    private final int textColor = 0xFF292821;
    private final int secondaryColor = 0xFF77746C;
    private final int accentColor = 0xFF9B8568;

    private LinearLayout roomContainer;
    private EditText searchInput;
    private final List<Room> rooms = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        loadRooms();
        buildScreen();
        displayRooms("");
    }

    private void loadRooms() {
        for (int i = 1; i <= 30; i++) {
            rooms.add(new Room("LR " + i, "Lecture Room"));
        }

        rooms.add(new Room("Auditorium Hall", "Campus Space"));
        rooms.add(new Room("Atrangi Workspace", "Campus Space"));
    }

    private void buildScreen() {
        ScrollView scrollView = new ScrollView(this);
        scrollView.setFillViewport(true);
        scrollView.setBackgroundColor(backgroundColor);

        LinearLayout container = new LinearLayout(this);
        container.setOrientation(LinearLayout.VERTICAL);
        container.setPadding(dp(22), dp(24), dp(22), dp(28));

        scrollView.addView(container);

        TextView backButton = new TextView(this);
        backButton.setText("←   Back to SpaceFinder");
        backButton.setTextSize(15);
        backButton.setTextColor(accentColor);
        backButton.setPadding(0, dp(8), 0, dp(20));
        backButton.setOnClickListener(v -> finish());
        container.addView(backButton);

        TextView eyebrow = new TextView(this);
        eyebrow.setText("CAMPUS DIRECTORY");
        eyebrow.setTextSize(11);
        eyebrow.setLetterSpacing(0.12f);
        eyebrow.setTextColor(accentColor);
        container.addView(eyebrow);

        TextView title = new TextView(this);
        title.setText("Find your\nspace.");
        title.setTextSize(34);
        title.setTextColor(textColor);
        title.setTypeface(null, Typeface.BOLD);

        LinearLayout.LayoutParams titleParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        titleParams.topMargin = dp(12);
        container.addView(title, titleParams);

        TextView description = new TextView(this);
        description.setText(
                "Explore lecture rooms and discover other campus spaces."
        );
        description.setTextSize(15);
        description.setTextColor(secondaryColor);

        LinearLayout.LayoutParams descriptionParams =
                new LinearLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.WRAP_CONTENT
                );
        descriptionParams.topMargin = dp(10);
        container.addView(description, descriptionParams);

        searchInput = new EditText(this);
        searchInput.setSingleLine(true);
        searchInput.setTextSize(14);
        searchInput.setHint("Search LR, auditorium, workspace");
        searchInput.setTextColor(textColor);
        searchInput.setHintTextColor(secondaryColor);
        searchInput.setPadding(dp(15), dp(10), dp(15), dp(10));
        searchInput.setBackgroundResource(R.drawable.bg_search);

        LinearLayout.LayoutParams searchParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(54)
        );
        searchParams.topMargin = dp(24);
        container.addView(searchInput, searchParams);

        TextView roomsHeading = new TextView(this);
        roomsHeading.setText("Lecture rooms & spaces");
        roomsHeading.setTextSize(20);
        roomsHeading.setTypeface(null, Typeface.BOLD);
        roomsHeading.setTextColor(textColor);

        LinearLayout.LayoutParams headingParams =
                new LinearLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.WRAP_CONTENT
                );
        headingParams.topMargin = dp(28);
        headingParams.bottomMargin = dp(14);
        container.addView(roomsHeading, headingParams);

        TextView notice = new TextView(this);
        notice.setText(
                "Directory names provided for the project. " +
                        "Availability and room details are not yet verified."
        );
        notice.setTextSize(12);
        notice.setTextColor(secondaryColor);

        LinearLayout.LayoutParams noticeParams =
                new LinearLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.WRAP_CONTENT
                );
        noticeParams.bottomMargin = dp(16);
        container.addView(notice, noticeParams);

        roomContainer = new LinearLayout(this);
        roomContainer.setOrientation(LinearLayout.VERTICAL);
        container.addView(roomContainer);

        searchInput.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(
                    CharSequence s, int start, int count, int after
            ) {
            }

            @Override
            public void onTextChanged(
                    CharSequence s, int start, int before, int count
            ) {
                displayRooms(s.toString());
            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });

        setContentView(scrollView);
    }

    private void displayRooms(String query) {
        roomContainer.removeAllViews();

        String normalizedQuery = query.trim().toLowerCase(Locale.ROOT);
        int matchCount = 0;

        for (Room room : rooms) {
            if (room.name.toLowerCase(Locale.ROOT).contains(normalizedQuery)
                    || room.type.toLowerCase(Locale.ROOT)
                    .contains(normalizedQuery)) {
                addRoomCard(room);
                matchCount++;
            }
        }

        if (matchCount == 0) {
            TextView emptyMessage = new TextView(this);
            emptyMessage.setText("No matching rooms or spaces found.");
            emptyMessage.setTextSize(14);
            emptyMessage.setTextColor(secondaryColor);
            emptyMessage.setPadding(dp(4), dp(20), dp(4), dp(20));
            roomContainer.addView(emptyMessage);
        }
    }

    private void addRoomCard(Room room) {
        LinearLayout card = new LinearLayout(this);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setPadding(dp(18), dp(17), dp(18), dp(17));
        card.setBackgroundResource(R.drawable.bg_card);
        card.setClickable(true);
        card.setFocusable(true);

        TextView roomTitle = new TextView(this);
        roomTitle.setText(room.name);
        roomTitle.setTextSize(18);
        roomTitle.setTextColor(textColor);
        roomTitle.setTypeface(null, Typeface.BOLD);
        card.addView(roomTitle);

        TextView roomType = new TextView(this);
        roomType.setText(room.type);
        roomType.setTextSize(13);
        roomType.setTextColor(secondaryColor);

        LinearLayout.LayoutParams typeParams =
                new LinearLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.WRAP_CONTENT
                );
        typeParams.topMargin = dp(6);
        card.addView(roomType, typeParams);

        LinearLayout.LayoutParams cardParams =
                new LinearLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.WRAP_CONTENT
                );
        cardParams.bottomMargin = dp(12);

        roomContainer.addView(card, cardParams);
    }

    private int dp(int value) {
        return (int) (value * getResources()
                .getDisplayMetrics().density + 0.5f);
    }

    private static class Room {
        final String name;
        final String type;

        Room(String name, String type) {
            this.name = name;
            this.type = type;
        }
    }
}