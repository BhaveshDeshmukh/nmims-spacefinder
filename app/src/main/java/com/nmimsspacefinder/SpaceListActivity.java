package com.nmimsspacefinder;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;
import java.util.Map;

/**
 * Shared behaviour for the Classroom, Laboratory and Search screens.
 * Each layout must contain: backButton, spaceSearch, spaceList,
 * emptyMessage and resultCount.
 */
public abstract class SpaceListActivity extends AppCompatActivity {

    public static final String EXTRA_QUERY = "query";

    private SpaceAdapter adapter;
    private RecyclerView recyclerView;
    private EditText searchInput;
    private TextView emptyMessage;
    private TextView resultCount;

    protected abstract int getLayoutRes();

    /** null means all categories. */
    protected abstract Space.Category getCategory();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(getLayoutRes());

        findViewById(R.id.backButton).setOnClickListener(v -> finish());

        searchInput = findViewById(R.id.spaceSearch);
        recyclerView = findViewById(R.id.spaceList);
        emptyMessage = findViewById(R.id.emptyMessage);
        resultCount = findViewById(R.id.resultCount);

        adapter = new SpaceAdapter(space -> {
            Intent intent = new Intent(this, SpaceDetailActivity.class);
            intent.putExtra(SpaceDetailActivity.EXTRA_SPACE_ID, space.id);
            startActivity(intent);
        });
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        recyclerView.setAdapter(adapter);

        String initialQuery = getIntent().getStringExtra(EXTRA_QUERY);
        if (initialQuery != null) {
            searchInput.setText(initialQuery);
            searchInput.setSelection(searchInput.getText().length());
        }

        searchInput.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int st, int c, int a) { }

            @Override
            public void onTextChanged(CharSequence s, int st, int b, int c) {
                applyFilter(s == null ? "" : s.toString());
            }

            @Override
            public void afterTextChanged(Editable s) { }
        });

        applyFilter(searchInput.getText().toString());
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Students only read availability. On failure we keep what we had.
        ApiClient.fetchAvailability(new ApiClient.Callback<Map<String, Space.Availability>>() {
            @Override
            public void onSuccess(Map<String, Space.Availability> result) {
                if (isFinishing() || isDestroyed()) return;
                SpaceRepository.setAvailability(result);
                applyFilter(searchInput.getText().toString());
            }

            @Override
            public void onError(ApiException error) {
                // Keep the last known data; availability stays "Unknown" if never loaded.
            }
        });
    }

    private void applyFilter(String query) {
        try {
            List<Space> results = SpaceRepository.search(getCategory(), query);
            adapter.setItems(results);

            boolean empty = results.isEmpty();
            emptyMessage.setText("No matching rooms found.");
            emptyMessage.setVisibility(empty ? View.VISIBLE : View.GONE);
            recyclerView.setVisibility(empty ? View.GONE : View.VISIBLE);
            resultCount.setText(results.size() == 1
                    ? "1 space" : results.size() + " spaces");
        } catch (SpaceDataException e) {
            SpaceRepository.refresh(); // the next keystroke retries the load
            adapter.setItems(null);
            recyclerView.setVisibility(View.GONE);
            resultCount.setText("");
            emptyMessage.setText("Rooms could not be loaded. Please try again.");
            emptyMessage.setVisibility(View.VISIBLE);
        }
    }
}