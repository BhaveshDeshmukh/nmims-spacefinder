package com.nmimsspacefinder;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * Single source of truth for campus spaces.
 * Currently sample data. Later this can be replaced by an API call
 * without changing the screens.
 */
public final class SpaceRepository {

    private static final List<Space> CLASSROOMS = new ArrayList<>();

    static {
        for (int i = 1; i <= 30; i++) {
            CLASSROOMS.add(new Space(
                    "lr-" + i, "LR " + i, "Lecture Room",
                    null, null, null, Space.Availability.UNKNOWN));
        }
        CLASSROOMS.add(new Space(
                "auditorium", "Auditorium Hall", "Campus Space",
                null, null, null, Space.Availability.UNKNOWN));
        CLASSROOMS.add(new Space(
                "atrangi", "Atrangi Workspace", "Campus Space",
                null, null, null, Space.Availability.UNKNOWN));
    }

    private SpaceRepository() {
    }

    public static List<Space> getClassrooms() {
        return new ArrayList<>(CLASSROOMS);
    }

    public static Space findById(String id) {
        if (id == null) return null;
        for (Space space : CLASSROOMS) {
            if (space.id.equals(id)) return space;
        }
        return null;
    }

    public static List<Space> searchClassrooms(String query) {
        String q = query == null ? "" : query.trim().toLowerCase(Locale.ROOT);
        List<Space> result = new ArrayList<>();
        for (Space s : CLASSROOMS) {
            if (q.isEmpty()
                    || contains(s.name, q)
                    || contains(s.typeLabel, q)
                    || contains(s.building, q)
                    || contains(s.floor, q)) {
                result.add(s);
            }
        }
        return result;
    }

    private static boolean contains(String field, String q) {
        return field != null && field.toLowerCase(Locale.ROOT).contains(q);
    }
}