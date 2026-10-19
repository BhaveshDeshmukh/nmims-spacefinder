package com.nmimsspacefinder;

import android.content.Intent;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private EditText searchInput;
    private LinearLayout classroomsButton;
    private LinearLayout labsButton;
    private LinearLayout availabilityButton;
    private LinearLayout facilitiesButton;
    private TextView crLoginLink;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        searchInput = findViewById(R.id.searchInput);
        classroomsButton = findViewById(R.id.classroomsButton);
        labsButton = findViewById(R.id.labsButton);
        availabilityButton = findViewById(R.id.availabilityButton);
        facilitiesButton = findViewById(R.id.facilitiesButton);
        crLoginLink = findViewById(R.id.crLoginLink);

        classroomsButton.setOnClickListener(v ->
                startActivity(new Intent(this, ClassroomActivity.class)));

        labsButton.setOnClickListener(v ->
                startActivity(new Intent(this, LaboratoryActivity.class)));

        availabilityButton.setOnClickListener(v ->
                showMessage("Room availability is coming next"));

        facilitiesButton.setOnClickListener(v ->
                showMessage("Campus facilities are coming next"));

        crLoginLink.setOnClickListener(v ->
                startActivity(new Intent(this, CRLoginActivity.class)));

        searchInput.setOnEditorActionListener((v, actionId, event) -> {
            boolean submittedByEnter = event != null
                    && event.getKeyCode() == KeyEvent.KEYCODE_ENTER
                    && event.getAction() == KeyEvent.ACTION_DOWN;

            if (actionId == EditorInfo.IME_ACTION_SEARCH || submittedByEnter) {
                String query = searchInput.getText().toString().trim();

                if (query.isEmpty()) {
                    searchInput.setError("Enter a room or laboratory");
                } else {
                    Intent intent = new Intent(this, SearchResultsActivity.class);
                    intent.putExtra(SpaceListActivity.EXTRA_QUERY, query);
                    startActivity(intent);
                }
                return true;
            }
            return false;
        });
    }

    private void showMessage(String message) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }
}