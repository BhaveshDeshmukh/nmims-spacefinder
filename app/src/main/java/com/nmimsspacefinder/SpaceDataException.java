package com.nmimsspacefinder;

public class SpaceDataException extends Exception {
    public SpaceDataException(String message) {
        super(message);
    }

    public SpaceDataException(String message, Throwable cause) {
        super(message, cause);
    }
}