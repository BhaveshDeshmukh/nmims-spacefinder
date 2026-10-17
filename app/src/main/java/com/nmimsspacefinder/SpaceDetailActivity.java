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

        Space space = SpaceRepository.findById(
                getIntent().getStringExtra(EXTRA_SPACE_ID));

        if (space == null) {
            Toast.makeText(this, "This space could not be found",
                    Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        findViewById(R.id.backButton).setOnClickListener(v -> finish());

        ((TextView) findViewById(R.id.detailName)).setText(space.name);
        ((TextView) findViewById(R.id.detailType)).setText(space.typeLabel);

        TextView badge = findViewById(R.id.detailBadge);
        badge.setText(space.availability.label);
        badge.setBackgroundResource(space.availability.badgeRes);

        ((TextView) findViewById(R.id.detailBuilding))
                .setText(Space.orNotVerified(space.building));
        ((TextView) findViewById(R.id.detailFloor))
                .setText(Space.orNotVerified(space.floor));
        ((TextView) findViewById(R.id.detailLocation))
                .setText(Space.orNotVerified(space.description));
        ((TextView) findViewById(R.id.detailAvailability))
                .setText(space.availability.label);
    }
}