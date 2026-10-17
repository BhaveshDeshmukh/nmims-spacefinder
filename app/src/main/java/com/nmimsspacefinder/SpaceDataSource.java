package com.nmimsspacefinder;

import java.util.List;

/**
 * Where space records come from. Today: LocalSpaceDataSource.
 * Later: an API-backed implementation using Member 2's endpoints.
 */
public interface SpaceDataSource {
    List<Space> loadSpaces() throws SpaceDataException;
}