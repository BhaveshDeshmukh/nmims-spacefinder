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

        String locationNote = space.hasLocation()
                ? "Location recorded by the project team."
                : "Location not verified yet. It will be added once confirmed.";
        String availabilityNote =
                space.source == Space.DataSource.BACKEND
                        ? " Availability as last reported by a Class Representative."
                        : " Availability has not been reported yet.";
        ((TextView) findViewById(R.id.detailNote))
                .setText(locationNote + availabilityNote);
    }
}