package com.nmimsspacefinder;

public class Space {

    public enum Availability {
        AVAILABLE("Available", R.drawable.bg_badge_available),
        OCCUPIED("Occupied", R.drawable.bg_badge_occupied),
        UNKNOWN("Unknown", R.drawable.bg_badge_unknown);

        public final String label;
        public final int badgeRes;

        Availability(String label, int badgeRes) {
            this.label = label;
            this.badgeRes = badgeRes;
        }
    }

    public static final String NOT_VERIFIED = "Not verified yet";

    public final String id;
    public final String name;
    public final String typeLabel;
    public final String building;     // null = not verified
    public final String floor;        // null = not verified
    public final String description;  // null = not verified
    public final Availability availability;

    public Space(String id, String name, String typeLabel, String building,
                 String floor, String description, Availability availability) {
        this.id = id;
        this.name = name;
        this.typeLabel = typeLabel;
        this.building = building;
        this.floor = floor;
        this.description = description;
        this.availability = availability == null
                ? Availability.UNKNOWN : availability;
    }

    public static String orNotVerified(String value) {
        return (value == null || value.trim().isEmpty()) ? NOT_VERIFIED : value;
    }
}