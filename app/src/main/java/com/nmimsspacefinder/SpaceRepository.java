package com.nmimsspacefinder;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Single access point for space data.
 * Locations come from the SpaceDataSource. Availability comes only from the
 * backend and is overlaid by id. Anything the backend did not report is UNKNOWN.
 */
public final class SpaceRepository {

    private static SpaceDataSource dataSource = new LocalSpaceDataSource();
    private static List<Space> cache;
    private static volatile Map<String, Space.Availability> overlay = new HashMap<>();

    private SpaceRepository() {
    }

    public static synchronized void setDataSource(SpaceDataSource source) {
        if (source != null) {
            dataSource = source;
            cache = null;
        }
    }

    public static synchronized void refresh() {
        cache = null;
    }

    /** Replaces all known backend availability (the backend is authoritative). */
    public static void setAvailability(Map<String, Space.Availability> latest) {
        overlay = latest == null ? new HashMap<>() : new HashMap<>(latest);
    }

    /** Records one value the backend has just confirmed. */
    public static void putAvailability(String id, Space.Availability confirmed) {
        Map<String, Space.Availability> copy = new HashMap<>(overlay);
        copy.put(id, confirmed);
        overlay = copy;
    }

    private static synchronized List<Space> load() throws SpaceDataException {
        if (cache == null) {
            List<Space> loaded;
            try {
                loaded = dataSource.loadSpaces();
            } catch (SpaceDataException e) {
                throw e;
            } catch (RuntimeException e) {
                throw new SpaceDataException("Could not load spaces", e);
            }
            if (loaded == null) {
                throw new SpaceDataException("No data was returned");
            }
            cache = new ArrayList<>(loaded);
        }
        return cache;
    }

    private static Space withOverlay(Space space) {
        Space.Availability reported = overlay.get(space.id);
        return reported == null
                ? space
                : space.withAvailability(reported, Space.DataSource.BACKEND);
    }

    /** category == null searches everything. A blank query returns everything. */
    public static List<Space> search(Space.Category category, String query)
            throws SpaceDataException {
        List<String> tokens = Space.tokenize(query);
        List<Space> result = new ArrayList<>();
        for (Space space : load()) {
            if (category != null && space.category != category) continue;
            if (tokens.isEmpty() || space.matches(tokens)) {
                result.add(withOverlay(space));
            }
        }
        return result;
    }

    public static Space findById(String id) throws SpaceDataException {
        if (id == null) return null;
        for (Space space : load()) {
            if (space.id.equals(id)) return withOverlay(space);
        }
        return null;
    }
}