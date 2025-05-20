package com.examscheduler.backend.dto;

// dto class for capturing user details during signup
public class SignupRequest {

    public SignupRequest() {
    }

    // initializes the signup request with username and password
    public SignupRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    private String username;
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
