package com.dawaalink.dto;

import java.util.UUID;

public class AuthResponse {
    private String token;
    private String role;
    private UUID pharmacyId;
    private String status;

    public AuthResponse() {}

    public AuthResponse(String token, String role, UUID pharmacyId, String status) {
        this.token = token;
        this.role = role;
        this.pharmacyId = pharmacyId;
        this.status = status;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public UUID getPharmacyId() { return pharmacyId; }
    public void setPharmacyId(UUID pharmacyId) { this.pharmacyId = pharmacyId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
