package com.nmimsspacefinder;

public class ClassroomActivity extends SpaceListActivity {

    @Override
    protected int getLayoutRes() {
        return R.layout.activity_classroom;
    }

    @Override
    protected Space.Category getCategory() {
        return Space.Category.CLASSROOM;
    }
}