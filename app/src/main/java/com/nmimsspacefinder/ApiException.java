package com.nmimsspacefinder;

public class ApiException extends Exception {

    public enum Type {
        NETWORK, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, VALIDATION, SERVER, BAD_RESPONSE
    }

    public final Type type;

    public ApiException(Type type, String message) {
        super(message);
        this.type = type;
    }
}