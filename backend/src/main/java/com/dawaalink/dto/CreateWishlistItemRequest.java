package com.dawaalink.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

public class CreateWishlistItemRequest {

    private String gtin;

    @NotBlank
    private String medicineName;

    @NotNull
    @Positive
    private Integer quantityNeeded;

    private LocalDate minAcceptableExpiry;

    public String getGtin() { return gtin; }
    public void setGtin(String gtin) { this.gtin = gtin; }

    public String getMedicineName() { return medicineName; }
    public void setMedicineName(String medicineName) { this.medicineName = medicineName; }

    public Integer getQuantityNeeded() { return quantityNeeded; }
    public void setQuantityNeeded(Integer quantityNeeded) { this.quantityNeeded = quantityNeeded; }

    public LocalDate getMinAcceptableExpiry() { return minAcceptableExpiry; }
    public void setMinAcceptableExpiry(LocalDate minAcceptableExpiry) { this.minAcceptableExpiry = minAcceptableExpiry; }
}
