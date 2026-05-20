package com.dawaalink.dto;

import java.util.UUID;
import java.time.LocalDateTime;

public class SwapCycleResponse {
    private UUID cycleId;
    private String status;
    private LocalDateTime createdAt;
    private String partnerPharmacyName;
    private String medicineName;
    private int quantity;
    private String direction;
    private String batchNumber;

    public SwapCycleResponse() {}

    public UUID getCycleId() { return cycleId; }
    public void setCycleId(UUID cycleId) { this.cycleId = cycleId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getPartnerPharmacyName() { return partnerPharmacyName; }
    public void setPartnerPharmacyName(String partnerPharmacyName) { this.partnerPharmacyName = partnerPharmacyName; }

    public String getMedicineName() { return medicineName; }
    public void setMedicineName(String medicineName) { this.medicineName = medicineName; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public String getDirection() { return direction; }
    public void setDirection(String direction) { this.direction = direction; }

    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }
}
