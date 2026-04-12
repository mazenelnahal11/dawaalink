package com.dawaalink.dto;

import com.dawaalink.model.enums.LockStatus;
import com.dawaalink.model.enums.StorageCondition;
import com.dawaalink.model.enums.Unit;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public class InventoryItemResponse {

    private UUID id;
    private String medicineName;
    private String batchNumber;
    private LocalDate expiryDate;
    private Integer quantityAvailable;
    private Unit unit;
    private StorageCondition storageCondition;
    private BigDecimal unitPrice;
    private LockStatus lockStatus;
    private long expiresInDays;
    private String badgeColor;

    public InventoryItemResponse() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }

    public String getBatchNumber() {
        return batchNumber;
    }

    public void setBatchNumber(String batchNumber) {
        this.batchNumber = batchNumber;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public Integer getQuantityAvailable() {
        return quantityAvailable;
    }

    public void setQuantityAvailable(Integer quantityAvailable) {
        this.quantityAvailable = quantityAvailable;
    }

    public Unit getUnit() {
        return unit;
    }

    public void setUnit(Unit unit) {
        this.unit = unit;
    }

    public StorageCondition getStorageCondition() {
        return storageCondition;
    }

    public void setStorageCondition(StorageCondition storageCondition) {
        this.storageCondition = storageCondition;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public LockStatus getLockStatus() {
        return lockStatus;
    }

    public void setLockStatus(LockStatus lockStatus) {
        this.lockStatus = lockStatus;
    }

    public long getExpiresInDays() {
        return expiresInDays;
    }

    public void setExpiresInDays(long expiresInDays) {
        this.expiresInDays = expiresInDays;
    }

    public String getBadgeColor() {
        return badgeColor;
    }

    public void setBadgeColor(String badgeColor) {
        this.badgeColor = badgeColor;
    }
}
