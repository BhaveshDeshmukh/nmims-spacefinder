package com.nmimsspacefinder;

public class LaboratoryActivity extends SpaceListActivity {

    @Override
    protected int getLayoutRes() {
        return R.layout.activity_laboratory;
    }

    @Override
    protected Space.Category getCategory() {
        return Space.Category.LABORATORY;
    }
}