package com.dawaalink.dto;

import java.util.UUID;

public class AuthResponse {
    private String token;
    private String role;
    private UUID pharmacyId;
    private String status;
    private String pharmacyName;
    private String district;
    private String profileImageUrl;

    public AuthResponse() {}

    public AuthResponse(String token, String role, UUID pharmacyId, String status, String pharmacyName, String district, String profileImageUrl) {
        this.token = token;
        this.role = role;
        this.pharmacyId = pharmacyId;
        this.status = status;
        this.pharmacyName = pharmacyName;
        this.district = district;
        this.profileImageUrl = profileImageUrl;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public UUID getPharmacyId() { return pharmacyId; }
    public void setPharmacyId(UUID pharmacyId) { this.pharmacyId = pharmacyId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPharmacyName() { return pharmacyName; }
    public void setPharmacyName(String pharmacyName) { this.pharmacyName = pharmacyName; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }
}
