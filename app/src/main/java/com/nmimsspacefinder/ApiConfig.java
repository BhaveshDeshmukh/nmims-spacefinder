package com.nmimsspacefinder;

/** The only place the backend address is defined. */
public final class ApiConfig {

    /**
     * Android emulator reaching a server on your PC at port 3000.
     * Ask Member 2 for the real port. For a physical phone use the PC's
     * LAN address; for production use an https:// URL.
     */
    public static final String BASE_URL = "http://10.0.2.2:3000";

    private ApiConfig() {
    }
}