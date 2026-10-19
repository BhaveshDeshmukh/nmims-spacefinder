package com.nmimsspacefinder;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class CRLoginActivity extends AppCompatActivity {

    public static final String EXTRA_MESSAGE = "message";

    private EditText collegeIdInput;
    private EditText passwordInput;
    private TextView errorText;
    private Button loginButton;
    private ProgressBar progress;
    private SessionManager session;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        session = new SessionManager(this);
        if (session.isLoggedIn()) {
            // The backend still checks the token on every update.
            startActivity(new Intent(this, CRDashboardActivity.class));
            finish();
            return;
        }

        setContentView(R.layout.activity_cr_login);

        collegeIdInput = findViewById(R.id.crCollegeId);
        passwordInput = findViewById(R.id.crPassword);
        errorText = findViewById(R.id.crError);
        loginButton = findViewById(R.id.crLoginButton);
        progress = findViewById(R.id.crProgress);

        findViewById(R.id.crLoginBack).setOnClickListener(v -> finish());
        loginButton.setOnClickListener(v -> attemptLogin());

        String message = getIntent().getStringExtra(EXTRA_MESSAGE);
        if (message != null) showError(message);
    }

    private void attemptLogin() {
        String collegeId = collegeIdInput.getText().toString().trim();
        String password = passwordInput.getText().toString();

        if (collegeId.isEmpty()) {
            collegeIdInput.setError("Enter your college ID");
            collegeIdInput.requestFocus();
            return;
        }
        if (password.isEmpty()) {
            passwordInput.setError("Enter your password");
            passwordInput.requestFocus();
            return;
        }

        errorText.setVisibility(View.GONE);
        setBusy(true);

        ApiClient.login(collegeId, password, new ApiClient.Callback<ApiClient.LoginResult>() {
            @Override
            public void onSuccess(ApiClient.LoginResult result) {
                if (isFinishing() || isDestroyed()) return;
                setBusy(false);
                passwordInput.setText("");

                if (!"CR".equals(result.role)) {
                    showError("This account is not a Class Representative account.");
                    return;
                }
                if (!session.save(result.token, result.name)) {
                    showError("Could not store your session securely on this device.");
                    return;
                }
                startActivity(new Intent(CRLoginActivity.this, CRDashboardActivity.class));
                finish();
            }

            @Override
            public void onError(ApiException error) {
                if (isFinishing() || isDestroyed()) return;
                setBusy(false);
                passwordInput.setText("");
                switch (error.type) {
                    case UNAUTHORIZED:
                        showError("Incorrect college ID or password.");
                        break;
                    case FORBIDDEN:
                        showError("This account is not authorised as a Class Representative.");
                        break;
                    default:
                        showError(error.getMessage());
                }
            }
        });
    }

    private void setBusy(boolean busy) {
        loginButton.setEnabled(!busy);
        progress.setVisibility(busy ? View.VISIBLE : View.GONE);
    }

    private void showError(String message) {
        errorText.setText(message);
        errorText.setVisibility(View.VISIBLE);
    }
}