package com.nmimsspacefinder;

import android.os.Bundle;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class SpaceDetailActivity extends AppCompatActivity {

    public static final String EXTRA_SPACE_ID = "space_id";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_space_detail);

        Space space;
        try {
            space = SpaceRepository.findById(
                    getIntent().getStringExtra(EXTRA_SPACE_ID));
        } catch (SpaceDataException e) {
            SpaceRepository.refresh();
            space = null;
        }

        if (space == null) {
            Toast.makeText(this, "This space could not be loaded",
                    Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        findViewById(R.id.backButton).setOnClickListener(v -> finish());

        ((TextView) findViewById(R.id.detailType)).setText(space.typeLabel);
        ((TextView) findViewById(R.id.detailName)).setText(space.name);
        ((TextView) findViewById(R.id.detailLocation))
                .setText(space.getLocationSummary());

        TextView badge = findViewById(R.id.detailBadge);
        badge.setText(space.availability.label);
        badge.setBackgroundResource(space.availability.badgeRes);

        ((TextView) findViewById(R.id.detailWing)).setText(space.wingLabel());
        ((TextView) findViewById(R.id.detailFloor)).setText(space.floorLabel());
        ((TextView) findViewById(R.id.detailSide)).setText(space.sideLabel());
        ((TextView) findViewById(R.id.detailAvailability))
                .setText(space.availability.label);

        String note = space.hasLocation()
                ? "Location recorded by the project team. Live availability is not available yet."
                : "Location not verified yet. It will be added once confirmed.";
        ((TextView) findViewById(R.id.detailNote)).setText(note);
    }
}