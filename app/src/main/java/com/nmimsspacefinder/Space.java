package com.nmimsspacefinder;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class Space {

    public enum Category { CLASSROOM, LABORATORY }

    public enum Wing {
        A("A Wing"), B("B Wing"), C("C Wing"), D("D Wing");

        public final String label;

        Wing(String label) {
            this.label = label;
        }
    }

    public enum Floor {
        GROUND("Ground Floor"), FIRST("1st Floor"), SECOND("2nd Floor");

        public final String label;

        Floor(String label) {
            this.label = label;
        }
    }

    public enum Side {
        LEFT("Left Side"), RIGHT("Right Side");

        public final String label;

        Side(String label) {
            this.label = label;
        }
    }

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

    /** Where the record came from. LOCAL = bundled in the app, BACKEND = Member 2's API. */
    public enum DataSource { LOCAL, BACKEND }

    public static final String NOT_VERIFIED = "Not verified yet";
    public static final String LOCATION_NOT_VERIFIED = "Location not verified yet";

    public final String id;
    public final String name;
    public final Category category;
    public final String typeLabel;
    public final Wing wing;        // null = not verified
    public final Floor floor;      // null = not verified
    public final Side side;        // null = not verified
    public final Availability availability;
    public final DataSource source;

    private final List<String> nameWords;
    private final List<String> allWords;

    public Space(String id, String name, String aliases, Category category,
                 String typeLabel, Wing wing, Floor floor, Side side,
                 Availability availability, DataSource source) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.typeLabel = typeLabel;
        this.wing = wing;
        this.floor = floor;
        this.side = side;
        this.availability = availability == null
                ? Availability.UNKNOWN : availability;
        this.source = source == null ? DataSource.LOCAL : source;

        this.nameWords = tokenize(name + " " + (aliases == null ? "" : aliases));
        this.allWords = new ArrayList<>(nameWords);
        this.allWords.addAll(tokenize(typeLabel));
        if (wing != null) this.allWords.addAll(tokenize(wing.label));
        if (floor != null) this.allWords.addAll(tokenize(floor.label));
        if (side != null) this.allWords.addAll(tokenize(side.label));
    }

    public boolean hasLocation() {
        return wing != null && floor != null && side != null;
    }

    /** Example: "B Wing · 2nd Floor · Right Side" */
    public String getLocationSummary() {
        if (!hasLocation()) return LOCATION_NOT_VERIFIED;
        return wing.label + " · " + floor.label + " · " + side.label;
    }

    public String wingLabel() {
        return wing == null ? NOT_VERIFIED : wing.label;
    }

    public String floorLabel() {
        return floor == null ? NOT_VERIFIED : floor.label;
    }

    public String sideLabel() {
        return side == null ? NOT_VERIFIED : side.label;
    }

    /**
     * Every query token must be the start of some word of this space.
     * Pure-number tokens only match the room name, so "LR 2" does not match
     * LR 10 just because LR 10 is on the "2nd" floor.
     */
    public boolean matches(List<String> queryTokens) {
        for (String token : queryTokens) {
            boolean numeric = token.matches("[0-9]+");
            List<String> pool = numeric ? nameWords : allWords;
            boolean found = false;
            for (String word : pool) {
                if (word.startsWith(token)) {
                    found = true;
                    break;
                }
            }
            if (!found) return false;
        }
        return true;
    }

    public static List<String> tokenize(String text) {
        List<String> words = new ArrayList<>();
        if (text == null) return words;
        for (String part : text.toLowerCase(Locale.ROOT).split("[^a-z0-9]+")) {
            if (!part.isEmpty()) words.add(part);
        }
        return words;
    }
}