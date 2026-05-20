package com.dawaalink.dto;

import java.time.LocalDate;
import java.util.UUID;

public class WishlistItemResponse {
    private UUID id;
    private String medicineName;
    private String gtin;
    private Integer quantityNeeded;
    private LocalDate minAcceptableExpiry;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getMedicineName() { return medicineName; }
    public void setMedicineName(String medicineName) { this.medicineName = medicineName; }

    public String getGtin() { return gtin; }
    public void setGtin(String gtin) { this.gtin = gtin; }

    public Integer getQuantityNeeded() { return quantityNeeded; }
    public void setQuantityNeeded(Integer quantityNeeded) { this.quantityNeeded = quantityNeeded; }

    public LocalDate getMinAcceptableExpiry() { return minAcceptableExpiry; }
    public void setMinAcceptableExpiry(LocalDate minAcceptableExpiry) { this.minAcceptableExpiry = minAcceptableExpiry; }
}
