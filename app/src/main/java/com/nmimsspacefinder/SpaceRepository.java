package com.nmimsspacefinder;

import java.util.ArrayList;
import java.util.List;

/**
 * Single access point for space data. Screens never talk to a data source
 * directly, so switching from local data to Member 2's API only touches
 * setDataSource().
 */
public final class SpaceRepository {

    private static SpaceDataSource dataSource = new LocalSpaceDataSource();
    private static List<Space> cache;

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

    /** category == null searches everything. A blank query returns everything. */
    public static List<Space> search(Space.Category category, String query)
            throws SpaceDataException {
        List<String> tokens = Space.tokenize(query);
        List<Space> result = new ArrayList<>();
        for (Space space : load()) {
            if (category != null && space.category != category) continue;
            if (tokens.isEmpty() || space.matches(tokens)) {
                result.add(space);
            }
        }
        return result;
    }

    public static Space findById(String id) throws SpaceDataException {
        if (id == null) return null;
        for (Space space : load()) {
            if (space.id.equals(id)) return space;
        }
        return null;
    }
}