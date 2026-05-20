package com.dawaalink.model;

import com.dawaalink.model.enums.LegStatus;
import jakarta.persistence.*;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "swap_leg")
public class SwapLeg {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cycle_id", nullable = false)
    private SwapCycle cycle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_pharmacy_id", nullable = false)
    private Pharmacy senderPharmacy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_pharmacy_id", nullable = false)
    private Pharmacy receiverPharmacy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_id", nullable = false)
    private InventoryItem inventoryItem;

    @Column(name = "quantity_transferred", nullable = false)
    private Integer quantityTransferred;

    @Enumerated(EnumType.STRING)
    @Column(name = "leg_status", nullable = false)
    private LegStatus legStatus;

    @Column(name = "delivery_pin")
    private String deliveryPin;

    @Column(name = "pin_attempts")
    private Integer pinAttempts;

    public SwapLeg() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public SwapCycle getCycle() {
        return cycle;
    }

    public void setCycle(SwapCycle cycle) {
        this.cycle = cycle;
    }

    public Pharmacy getSenderPharmacy() {
        return senderPharmacy;
    }

    public void setSenderPharmacy(Pharmacy senderPharmacy) {
        this.senderPharmacy = senderPharmacy;
    }

    public Pharmacy getReceiverPharmacy() {
        return receiverPharmacy;
    }

    public void setReceiverPharmacy(Pharmacy receiverPharmacy) {
        this.receiverPharmacy = receiverPharmacy;
    }

    public InventoryItem getInventoryItem() {
        return inventoryItem;
    }

    public void setInventoryItem(InventoryItem inventoryItem) {
        this.inventoryItem = inventoryItem;
    }

    public Integer getQuantityTransferred() {
        return quantityTransferred;
    }

    public void setQuantityTransferred(Integer quantityTransferred) {
        this.quantityTransferred = quantityTransferred;
    }

    public LegStatus getLegStatus() {
        return legStatus;
    }

    public void setLegStatus(LegStatus legStatus) {
        this.legStatus = legStatus;
    }

    public String getDeliveryPin() {
        return deliveryPin;
    }

    public void setDeliveryPin(String deliveryPin) {
        this.deliveryPin = deliveryPin;
    }

    public Integer getPinAttempts() {
        return pinAttempts;
    }

    public void setPinAttempts(Integer pinAttempts) {
        this.pinAttempts = pinAttempts;
    }
}
