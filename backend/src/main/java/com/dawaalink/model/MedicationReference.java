package com.dawaalink.model;

import com.dawaalink.model.enums.StorageCondition;
import jakarta.persistence.*;

@Entity
@Table(name = "medication_reference")
public class MedicationReference {

    @Id
    @Column(length = 50)
    private String gtin;

    @Column(name = "trade_name", nullable = false)
    private String tradeName;

    @Column(name = "scientific_name", nullable = false)
    private String scientificName;

    private String manufacturer;

    @Enumerated(EnumType.STRING)
    @Column(name = "storage_condition", nullable = false)
    private StorageCondition storageCondition;

    @Column(name = "is_controlled", nullable = false)
    private Boolean isControlled = false;

    public MedicationReference() {}

    public String getGtin() {
        return gtin;
    }

    public void setGtin(String gtin) {
        this.gtin = gtin;
    }

    public String getTradeName() {
        return tradeName;
    }

    public void setTradeName(String tradeName) {
        this.tradeName = tradeName;
    }

    public String getScientificName() {
        return scientificName;
    }

    public void setScientificName(String scientificName) {
        this.scientificName = scientificName;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public StorageCondition getStorageCondition() {
        return storageCondition;
    }

    public void setStorageCondition(StorageCondition storageCondition) {
        this.storageCondition = storageCondition;
    }

    public Boolean getIsControlled() {
        return isControlled;
    }

    public void setIsControlled(Boolean isControlled) {
        this.isControlled = isControlled;
    }
}
