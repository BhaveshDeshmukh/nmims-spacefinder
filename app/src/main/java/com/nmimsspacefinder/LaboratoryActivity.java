package com.nmimsspacefinder;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.widget.EditText;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class LaboratoryActivity extends AppCompatActivity {

    private EditText laboratorySearch;
    private TextView laboratoryNotice;
    private TextView emptyMessage;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_laboratory);

        laboratorySearch = findViewById(R.id.laboratorySearch);
        laboratoryNotice = findViewById(R.id.laboratoryNotice);
        emptyMessage = findViewById(R.id.emptyMessage);
        TextView backButton = findViewById(R.id.backButton);

        backButton.setOnClickListener(v -> finish());

        laboratorySearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(
                    CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(
                    CharSequence s, int start, int before, int count) {
                updateSearchState(s.toString());
            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });
    }

    private void updateSearchState(String query) {
        if (query.trim().isEmpty()) {
            laboratoryNotice.setText(
                    "Laboratory names and details will appear here once verified campus information is available."
            );
            laboratoryNotice.setVisibility(android.view.View.VISIBLE);
            emptyMessage.setVisibility(android.view.View.GONE);
        } else {
            laboratoryNotice.setVisibility(android.view.View.GONE);
            emptyMessage.setText(
                    "No verified laboratory matches \"" + query.trim() + "\" yet."
            );
            emptyMessage.setVisibility(android.view.View.VISIBLE);
        }
    }
}