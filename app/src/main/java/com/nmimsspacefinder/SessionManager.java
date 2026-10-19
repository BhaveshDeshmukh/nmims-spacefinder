package com.nmimsspacefinder;

import android.content.Context;
import android.content.SharedPreferences;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Base64;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.Key;
import java.security.KeyStore;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;

/**
 * Stores only the access token, encrypted with a key held in the Android
 * Keystore. Passwords are never stored. Requires minSdk 23 or higher.
 */
public class SessionManager {

    private static final String PREFS = "cr_session";
    private static final String KEY_TOKEN = "token";
    private static final String KEY_NAME = "name";
    private static final String KEYSTORE = "AndroidKeyStore";
    private static final String ALIAS = "spacefinder_cr_session_key";

    private final SharedPreferences prefs;

    public SessionManager(Context context) {
        prefs = context.getApplicationContext()
                .getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    /** Returns false if the token could not be stored securely. */
    public boolean save(String token, String name) {
        String encrypted = encrypt(token);
        if (encrypted == null) return false;
        prefs.edit().putString(KEY_TOKEN, encrypted).putString(KEY_NAME, name).apply();
        return true;
    }

    public String getToken() {
        String stored = prefs.getString(KEY_TOKEN, null);
        if (stored == null) return null;
        String token = decrypt(stored);
        if (token == null) clear(); // unreadable, treat as logged out
        return token;
    }

    public String getName() {
        return prefs.getString(KEY_NAME, "");
    }

    public boolean isLoggedIn() {
        return getToken() != null;
    }

    public void clear() {
        prefs.edit().clear().apply();
    }

    // ------------------------------------------------------------------

    private static SecretKey getKey() throws GeneralSecurityException, IOException {
        KeyStore store = KeyStore.getInstance(KEYSTORE);
        store.load(null);
        Key existing = store.getKey(ALIAS, null);
        if (existing instanceof SecretKey) return (SecretKey) existing;

        KeyGenerator generator =
                KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, KEYSTORE);
        generator.init(new KeyGenParameterSpec.Builder(ALIAS,
                KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT)
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .setKeySize(256)
                .build());
        return generator.generateKey();
    }

    private static String encrypt(String plain) {
        try {
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.ENCRYPT_MODE, getKey());
            byte[] iv = cipher.getIV();
            byte[] data = cipher.doFinal(plain.getBytes(StandardCharsets.UTF_8));
            return Base64.encodeToString(iv, Base64.NO_WRAP) + ":"
                    + Base64.encodeToString(data, Base64.NO_WRAP);
        } catch (GeneralSecurityException | IOException e) {
            return null;
        }
    }

    private static String decrypt(String stored) {
        try {
            String[] parts = stored.split(":");
            if (parts.length != 2) return null;
            byte[] iv = Base64.decode(parts[0], Base64.NO_WRAP);
            byte[] data = Base64.decode(parts[1], Base64.NO_WRAP);
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.DECRYPT_MODE, getKey(), new GCMParameterSpec(128, iv));
            return new String(cipher.doFinal(data), StandardCharsets.UTF_8);
        } catch (GeneralSecurityException | IOException | IllegalArgumentException e) {
            return null;
        }
    }
}