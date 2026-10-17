package com.nmimsspacefinder;

public class SearchResultsActivity extends SpaceListActivity {

    @Override
    protected int getLayoutRes() {
        return R.layout.activity_search_results;
    }

    @Override
    protected Space.Category getCategory() {
        return null; // classrooms and laboratories
    }
}