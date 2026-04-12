package com.dawaalink.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    @NotBlank
    private String pharmacyName;
    @NotBlank
    private String district;
    @NotBlank
    private String ownerName;
    @NotBlank
    private String commercialRegNo;
    @NotBlank
    private String pharmacistContact;
    @Email
    @NotBlank
    private String email;
    @NotBlank
    @Size(min = 6)
    private String password;

    public RegisterRequest() {}

    public String getPharmacyName() { return pharmacyName; }
    public void setPharmacyName(String pharmacyName) { this.pharmacyName = pharmacyName; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getCommercialRegNo() { return commercialRegNo; }
    public void setCommercialRegNo(String commercialRegNo) { this.commercialRegNo = commercialRegNo; }

    public String getPharmacistContact() { return pharmacistContact; }
    public void setPharmacistContact(String pharmacistContact) { this.pharmacistContact = pharmacistContact; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
