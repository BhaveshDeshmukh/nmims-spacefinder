package com.nmimsspacefinder;

import android.os.Handler;
import android.os.Looper;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * All backend calls. Runs on a background thread, replies on the main thread.
 * Never logs tokens or passwords.
 */
public final class ApiClient {

    public interface Callback<T> {
        void onSuccess(T result);

        void onError(ApiException error);
    }

    public static final class LoginResult {
        public final String token;
        public final String name;
        public final String role;

        LoginResult(String token, String name, String role) {
            this.token = token;
            this.name = name;
            this.role = role;
        }
    }

    private interface Call<T> {
        T execute() throws ApiException;
    }

    private static final ExecutorService EXECUTOR = Executors.newFixedThreadPool(2);
    private static final Handler MAIN = new Handler(Looper.getMainLooper());

    private ApiClient() {
    }

    // POST /api/cr/login
    public static void login(String collegeId, String password,
                             Callback<LoginResult> callback) {
        run(callback, () -> {
            try {
                JSONObject body = new JSONObject();
                body.put("collegeId", collegeId);
                body.put("password", password);
                JSONObject json = request("POST", "/api/cr/login", null, body);

                String token = json.optString("token", "");
                JSONObject user = json.optJSONObject("user");
                if (token.isEmpty() || user == null) {
                    throw new ApiException(ApiException.Type.BAD_RESPONSE,
                            "The server sent an unexpected login response.");
                }
                return new LoginResult(token,
                        user.optString("name", ""), user.optString("role", ""));
            } catch (JSONException e) {
                throw new ApiException(ApiException.Type.BAD_RESPONSE,
                        "The server sent an unexpected login response.");
            }
        });
    }

    // GET /api/spaces  ->  { "spaces": [ { "id": "...", "availability": "..." } ] }
    public static void fetchAvailability(
            Callback<Map<String, Space.Availability>> callback) {
        run(callback, () -> {
            JSONObject json = request("GET", "/api/spaces", null, null);
            JSONArray array = json.optJSONArray("spaces");
            if (array == null) {
                throw new ApiException(ApiException.Type.BAD_RESPONSE,
                        "The server sent an unexpected space list.");
            }
            Map<String, Space.Availability> map = new HashMap<>();
            for (int i = 0; i < array.length(); i++) {
                JSONObject item = array.optJSONObject(i);
                if (item == null) continue;
                String id = item.optString("id", "");
                if (id.isEmpty()) continue;
                map.put(id, Space.Availability.parse(item.optString("availability")));
            }
            return map;
        });
    }

    // PATCH /api/spaces/{id}/availability  (Authorization: Bearer <token>)
    public static void updateAvailability(String token, String spaceId,
                                          Space.Availability status,
                                          Callback<Space.Availability> callback) {
        run(callback, () -> {
            try {
                String path = "/api/spaces/"
                        + URLEncoder.encode(spaceId, "UTF-8") + "/availability";
                JSONObject body = new JSONObject();
                body.put("availability", status.name());
                JSONObject json = request("PATCH", path, token, body);

                String confirmed = json.optString("availability", "");
                if (confirmed.isEmpty()) {
                    throw new ApiException(ApiException.Type.BAD_RESPONSE,
                            "The server did not confirm the update.");
                }
                return Space.Availability.parse(confirmed);
            } catch (JSONException | IOException e) {
                throw new ApiException(ApiException.Type.BAD_RESPONSE,
                        "The update request could not be built.");
            }
        });
    }

    // ------------------------------------------------------------------

    private static <T> void run(Callback<T> callback, Call<T> call) {
        EXECUTOR.execute(() -> {
            try {
                T result = call.execute();
                MAIN.post(() -> callback.onSuccess(result));
            } catch (ApiException e) {
                MAIN.post(() -> callback.onError(e));
            } catch (RuntimeException e) {
                MAIN.post(() -> callback.onError(new ApiException(
                        ApiException.Type.BAD_RESPONSE, "Something went wrong.")));
            }
        });
    }

    private static JSONObject request(String method, String path, String token,
                                      JSONObject body) throws ApiException {
        HttpURLConnection conn = null;
        try {
            conn = (HttpURLConnection) new URL(ApiConfig.BASE_URL + path).openConnection();
            conn.setConnectTimeout(10000);
            conn.setReadTimeout(10000);
            conn.setRequestMethod(method);
            conn.setRequestProperty("Accept", "application/json");
            if (token != null) {
                conn.setRequestProperty("Authorization", "Bearer " + token);
            }
            if (body != null) {
                conn.setRequestProperty("Content-Type", "application/json; charset=utf-8");
                conn.setDoOutput(true);
                try (OutputStream out = conn.getOutputStream()) {
                    out.write(body.toString().getBytes(StandardCharsets.UTF_8));
                }
            }

            int code = conn.getResponseCode();
            InputStream stream = code >= 400 ? conn.getErrorStream() : conn.getInputStream();
            String text = stream == null ? "" : readAll(stream);

            if (code >= 200 && code < 300) {
                return text.trim().isEmpty() ? new JSONObject() : new JSONObject(text);
            }
            throw toException(code, text);
        } catch (IOException e) {
            throw new ApiException(ApiException.Type.NETWORK,
                    "Can't reach the server. Check your connection and try again.");
        } catch (JSONException e) {
            throw new ApiException(ApiException.Type.BAD_RESPONSE,
                    "The server sent an unreadable response.");
        } finally {
            if (conn != null) conn.disconnect();
        }
    }

    private static ApiException toException(int code, String text) {
        String message = null;
        try {
            message = new JSONObject(text).optString("error", null);
        } catch (JSONException ignored) {
            // no JSON body
        }
        switch (code) {
            case 400:
            case 422:
                return new ApiException(ApiException.Type.VALIDATION,
                        message != null ? message : "The request was not valid.");
            case 401:
                return new ApiException(ApiException.Type.UNAUTHORIZED,
                        message != null ? message : "Authentication failed.");
            case 403:
                return new ApiException(ApiException.Type.FORBIDDEN,
                        message != null ? message : "This account is not authorised.");
            case 404:
                return new ApiException(ApiException.Type.NOT_FOUND,
                        message != null ? message : "Not found.");
            default:
                return new ApiException(ApiException.Type.SERVER,
                        "The server had a problem (" + code + "). Try again later.");
        }
    }

    private static String readAll(InputStream in) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader r = new BufferedReader(
                new InputStreamReader(in, StandardCharsets.UTF_8))) {
            String line;
            while ((line = r.readLine()) != null) sb.append(line);
        }
        return sb.toString();
    }
}