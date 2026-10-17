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

public class ClassroomActivity extends AppCompatActivity {

    private SpaceAdapter adapter;
    private TextView emptyMessage;
    private TextView resultCount;
    private RecyclerView recyclerView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_classroom);

        TextView backButton = findViewById(R.id.backButton);
        EditText searchInput = findViewById(R.id.classroomSearch);
        recyclerView = findViewById(R.id.classroomList);
        emptyMessage = findViewById(R.id.emptyMessage);
        resultCount = findViewById(R.id.resultCount);

        backButton.setOnClickListener(v -> finish());

        adapter = new SpaceAdapter(space -> {
            Intent intent = new Intent(this, SpaceDetailActivity.class);
            intent.putExtra(SpaceDetailActivity.EXTRA_SPACE_ID, space.id);
            startActivity(intent);
        });
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        recyclerView.setAdapter(adapter);

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

        applyFilter("");
    }

    private void applyFilter(String query) {
        List<Space> results = SpaceRepository.searchClassrooms(query);
        adapter.setItems(results);

        boolean empty = results.isEmpty();
        emptyMessage.setVisibility(empty ? View.VISIBLE : View.GONE);
        recyclerView.setVisibility(empty ? View.GONE : View.VISIBLE);
        resultCount.setText(results.size() == 1
                ? "1 space" : results.size() + " spaces");
    }
}