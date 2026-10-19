package com.nmimsspacefinder;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;
import java.util.Map;

public class CRDashboardActivity extends AppCompatActivity {

    /** Statuses a CR may set. UNKNOWN is never submitted. */
    private static final Space.Availability[] STATUSES = {
            Space.Availability.AVAILABLE,
            Space.Availability.OCCUPIED,
            Space.Availability.UNAVAILABLE
    };

    private SessionManager session;
    private SpaceAdapter adapter;
    private RecyclerView list;
    private EditText searchInput;
    private TextView statusMessage;
    private TextView resultCount;
    private TextView emptyMessage;
    private View panel;
    private TextView selName;
    private TextView selLocation;
    private TextView selCurrent;
    private Spinner spinner;
    private Button updateButton;

    private Space selected;
    private boolean updating;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        session = new SessionManager(this);
        if (!session.isLoggedIn()) {
            goToLogin(null);
            return;
        }

        setContentView(R.layout.activity_cr_dashboard);

        list = findViewById(R.id.crList);
        searchInput = findViewById(R.id.crSearch);
        statusMessage = findViewById(R.id.crStatusMessage);
        resultCount = findViewById(R.id.crResultCount);
        emptyMessage = findViewById(R.id.crEmptyMessage);
        panel = findViewById(R.id.crPanel);
        selName = findViewById(R.id.crSelName);
        selLocation = findViewById(R.id.crSelLocation);
        selCurrent = findViewById(R.id.crSelCurrent);
        spinner = findViewById(R.id.crSpinner);
        updateButton = findViewById(R.id.crUpdateButton);

        String[] labels = new String[STATUSES.length];
        for (int i = 0; i < STATUSES.length; i++) labels[i] = STATUSES[i].label;
        ArrayAdapter<String> spinnerAdapter = new ArrayAdapter<>(
                this, android.R.layout.simple_spinner_item, labels);
        spinnerAdapter.setDropDownViewResource(
                android.R.layout.simple_spinner_dropdown_item);
        spinner.setAdapter(spinnerAdapter);

        adapter = new SpaceAdapter(space -> select(space));
        list.setLayoutManager(new LinearLayoutManager(this));
        list.setAdapter(adapter);

        ((TextView) findViewById(R.id.crWelcome)).setText(
                session.getName().isEmpty()
                        ? "Signed in as Class Representative"
                        : "Signed in as " + session.getName());

        findViewById(R.id.crBack).setOnClickListener(v -> finish());
        findViewById(R.id.crRefresh).setOnClickListener(v -> loadLatest());
        findViewById(R.id.crLogout).setOnClickListener(v -> logout());
        updateButton.setOnClickListener(v -> submitUpdate());

        searchInput.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int st, int c, int a) { }

            @Override
            public void onTextChanged(CharSequence s, int st, int b, int c) {
                applyFilter();
            }

            @Override
            public void afterTextChanged(Editable s) { }
        });

        applyFilter();
        loadLatest();
    }

    // ---- loading ------------------------------------------------------

    private void loadLatest() {
        showStatus("Loading latest availability…");
        ApiClient.fetchAvailability(new ApiClient.Callback<Map<String, Space.Availability>>() {
            @Override
            public void onSuccess(Map<String, Space.Availability> result) {
                if (isFinishing() || isDestroyed()) return;
                SpaceRepository.setAvailability(result);
                hideStatus();
                applyFilter();
                resyncSelected();
            }

            @Override
            public void onError(ApiException error) {
                if (isFinishing() || isDestroyed()) return;
                showStatus("Couldn't load the latest availability. "
                        + error.getMessage() + " Showing last known data.");
            }
        });
    }

    private void applyFilter() {
        try {
            List<Space> results = SpaceRepository.search(
                    null, searchInput.getText().toString());
            adapter.setItems(results);
            boolean empty = results.isEmpty();
            emptyMessage.setVisibility(empty ? View.VISIBLE : View.GONE);
            list.setVisibility(empty ? View.GONE : View.VISIBLE);
            resultCount.setText(results.size() == 1
                    ? "1 space" : results.size() + " spaces");
        } catch (SpaceDataException e) {
            SpaceRepository.refresh();
            adapter.setItems(null);
            list.setVisibility(View.GONE);
            resultCount.setText("");
            emptyMessage.setText("Rooms could not be loaded. Please try again.");
            emptyMessage.setVisibility(View.VISIBLE);
        }
    }

    // ---- selection ----------------------------------------------------

    private void select(Space space) {
        selected = space;
        panel.setVisibility(View.VISIBLE);
        selName.setText(space.name);
        selLocation.setText(space.getLocationSummary());
        selCurrent.setText("Current status: " + space.availability.label);

        int index = 0;
        for (int i = 0; i < STATUSES.length; i++) {
            if (STATUSES[i] == space.availability) index = i;
        }
        spinner.setSelection(index);
        updateButton.setEnabled(!updating);
    }

    private void resyncSelected() {
        if (selected == null) return;
        try {
            Space fresh = SpaceRepository.findById(selected.id);
            if (fresh != null) select(fresh);
        } catch (SpaceDataException ignored) {
            // keep showing the previous selection
        }
    }

    // ---- update -------------------------------------------------------

    private void submitUpdate() {
        if (selected == null || updating) return;

        String token = session.getToken();
        if (token == null) {
            handleSessionProblem(ApiException.Type.UNAUTHORIZED);
            return;
        }

        Space.Availability target = STATUSES[spinner.getSelectedItemPosition()];
        if (target == selected.availability) {
            Toast.makeText(this, selected.name + " is already shown as "
                    + target.label, Toast.LENGTH_SHORT).show();
            return;
        }

        final String spaceId = selected.id;
        final String spaceName = selected.name;
        setUpdating(true);
        hideStatus();

        ApiClient.updateAvailability(token, spaceId, target,
                new ApiClient.Callback<Space.Availability>() {
                    @Override
                    public void onSuccess(Space.Availability confirmed) {
                        if (isFinishing() || isDestroyed()) return;
                        setUpdating(false);
                        // Only now, after the server confirmed it, do we show it.
                        SpaceRepository.putAvailability(spaceId, confirmed);
                        Toast.makeText(CRDashboardActivity.this,
                                spaceName + " saved as " + confirmed.label,
                                Toast.LENGTH_SHORT).show();
                        applyFilter();
                        resyncSelected();
                        loadLatest();
                    }

                    @Override
                    public void onError(ApiException error) {
                        if (isFinishing() || isDestroyed()) return;
                        setUpdating(false);
                        if (error.type == ApiException.Type.UNAUTHORIZED
                                || error.type == ApiException.Type.FORBIDDEN) {
                            handleSessionProblem(error.type);
                        } else {
                            // The last confirmed status stays on screen.
                            showStatus("Update failed: " + error.getMessage()
                                    + " The status was not changed.");
                        }
                    }
                });
    }

    private void setUpdating(boolean value) {
        updating = value;
        updateButton.setEnabled(!value);
        updateButton.setText(value ? "Updating…" : "Update Status");
    }

    // ---- session ------------------------------------------------------

    private void handleSessionProblem(ApiException.Type type) {
        session.clear();
        goToLogin(type == ApiException.Type.FORBIDDEN
                ? "This account is not authorised to update availability."
                : "Your session has expired. Please log in again.");
    }

    private void logout() {
        session.clear();
        Toast.makeText(this, "Logged out", Toast.LENGTH_SHORT).show();
        Intent intent = new Intent(this, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        startActivity(intent);
        finish();
    }

    private void goToLogin(String message) {
        Intent intent = new Intent(this, CRLoginActivity.class);
        if (message != null) intent.putExtra(CRLoginActivity.EXTRA_MESSAGE, message);
        startActivity(intent);
        finish();
    }

    // ---- status line --------------------------------------------------

    private void showStatus(String message) {
        statusMessage.setText(message);
        statusMessage.setVisibility(View.VISIBLE);
    }

    private void hideStatus() {
        statusMessage.setVisibility(View.GONE);
    }
}