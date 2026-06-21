package com.thanaproj.roadmapx_be.APIResponse;

import com.thanaproj.roadmapx_be.Enum.Role;

public class AuthResponse {
    private String token;
    private String message;
    private Role role;
    private String username;
    
    public AuthResponse(String token, String message, Role role, String username) {
        this.token = token;
        this.message = message;
        this.role = role;
        this.username = username;
    }

    public String getToken() {
        return token;
    }
    public String getMessage() {
        return message; 
    }
    public Role getRole() {
        return role;
    }
    public String getUsername() {
        return username;
    }
    public void setToken(String token) {
        this.token = token;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public void setRole(Role role) {
        this.role = role;
    }
    public void setUsername(String username) {
        this.username = username;
    }
}
