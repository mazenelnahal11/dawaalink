package com.dawaalink.service;

import com.dawaalink.dto.CreateInventoryItemRequest;
import com.dawaalink.dto.InventoryItemResponse;
import com.dawaalink.exception.BusinessRuleException;
import com.dawaalink.exception.ResourceNotFoundException;
import com.dawaalink.model.InventoryItem;
import com.dawaalink.model.MedicationReference;
import com.dawaalink.model.Pharmacy;
import com.dawaalink.model.SystemAlert;
import com.dawaalink.model.enums.LockStatus;
import com.dawaalink.model.enums.StorageCondition;
import com.dawaalink.repository.InventoryItemRepository;
import com.dawaalink.repository.MedicationReferenceRepository;
import com.dawaalink.repository.PharmacyRepository;
import com.dawaalink.repository.SystemAlertRepository;
import com.dawaalink.util.ExpiryUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.math.BigDecimal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class InventoryService {
    private static final Logger log = LoggerFactory.getLogger(InventoryService.class);

    private final InventoryItemRepository inventoryRepository;
    private final MedicationReferenceRepository medicationRepository;
    private final PharmacyRepository pharmacyRepository;
    private final SystemAlertRepository alertRepository;

    public InventoryService(InventoryItemRepository inventoryRepository,
                            MedicationReferenceRepository medicationRepository,
                            PharmacyRepository pharmacyRepository,
                            SystemAlertRepository alertRepository) {
        this.inventoryRepository = inventoryRepository;
        this.medicationRepository = medicationRepository;
        this.pharmacyRepository = pharmacyRepository;
        this.alertRepository = alertRepository;
    }

    @Transactional
    public InventoryItemResponse addDeadStock(UUID pharmacyId, CreateInventoryItemRequest request) {
        log.info("Adding dead stock for pharmacy: {} - Medicine: {} (GTIN: {})", pharmacyId, request.getMedicineName(), request.getGtin());
        try {
            Pharmacy pharmacy = pharmacyRepository.findById(pharmacyId)
                    .orElseThrow(() -> new ResourceNotFoundException("Pharmacy not found"));

        MedicationReference medRef = null;
        if (request.getGtin() != null && !request.getGtin().isEmpty()) {
            medRef = medicationRepository.findById(request.getGtin()).orElse(null);
        }

        if (medRef == null) {
            medRef = medicationRepository.findByTradeNameIgnoreCaseOrScientificNameIgnoreCase(
                            request.getMedicineName(), request.getMedicineName())
                    .orElse(null);
        }

        boolean isControlled = medRef != null && Boolean.TRUE.equals(medRef.getIsControlled());

        if (medRef == null) {
            medRef = new MedicationReference();
            medRef.setGtin(UUID.randomUUID().toString().substring(0, 14));
            medRef.setTradeName(request.getMedicineName());
            medRef.setScientificName(request.getMedicineName());
            medRef.setStorageCondition(request.getStorageCondition());
            medRef.setIsControlled(false);
            medRef = medicationRepository.save(medRef);
        }

        InventoryItem item = new InventoryItem();
        item.setPharmacy(pharmacy);
        item.setMedication(medRef);
        item.setBatchNumber(request.getBatchNumber());
        item.setExpiryDate(request.getExpiryDate());
        item.setQuantityAvailable(request.getQuantityAvailable());
        item.setUnit(request.getUnit());
        item.setUnitPrice(request.getUnitPrice());

        if (isControlled) {
            item.setLockStatus(LockStatus.FLAGGED);
            SystemAlert alert = new SystemAlert();
            alert.setType("CONTROLLED_SUBSTANCE_FLAG");
            alert.setMessage("Pharmacy attempted to list controlled substance: " + request.getMedicineName());
            alert.setRelatedEntityId(pharmacyId);
            alertRepository.save(alert);
        } else if (request.getStorageCondition() == StorageCondition.COLD_CHAIN) {
            item.setLockStatus(LockStatus.FLAGGED);
        } else {
            item.setLockStatus(LockStatus.ACTIVE);
        }

            item = inventoryRepository.save(item);
            log.info("Successfully added inventory item: {}", item.getId());
            return mapToResponse(item);
        } catch (Exception e) {
            log.error("Failed to add dead stock: {}", e.getMessage(), e);
            throw e;
        }
    }

    public List<InventoryItemResponse> getPharmacyInventory(UUID pharmacyId) {
        return inventoryRepository.findByPharmacyId(pharmacyId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<InventoryItemResponse> getNearExpiryItems(UUID pharmacyId, int thresholdDays) {
        LocalDate thresholdDate = LocalDate.now().plusDays(thresholdDays);
        return inventoryRepository.findByPharmacyIdAndExpiryDateBefore(pharmacyId, thresholdDate).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public InventoryItemResponse updateItem(UUID itemId, UUID pharmacyId, Integer newQuantity, String notes) {
        InventoryItem item = inventoryRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found"));

        if (!item.getPharmacy().getId().equals(pharmacyId)) {
            throw new SecurityException("Not authorized to modify this item");
        }
        if (item.getLockStatus() != LockStatus.ACTIVE) {
            throw new BusinessRuleException("Cannot update locked or flagged items");
        }

        if (newQuantity != null && newQuantity > 0) {
            item.setQuantityAvailable(newQuantity);
        }

        return mapToResponse(inventoryRepository.save(item));
    }

    @Transactional
    public void deleteListing(UUID itemId, UUID pharmacyId) {
        InventoryItem item = inventoryRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found"));

        if (!item.getPharmacy().getId().equals(pharmacyId)) {
            throw new SecurityException("Not authorized to delete this item");
        }
        if (item.getLockStatus() != LockStatus.ACTIVE) {
            throw new BusinessRuleException("Cannot delete locked items");
        }

        inventoryRepository.delete(item);
    }

    private InventoryItemResponse mapToResponse(InventoryItem item) {
        InventoryItemResponse resp = new InventoryItemResponse();
        resp.setId(item.getId());
        resp.setMedicineName(item.getMedication().getTradeName());
        resp.setBatchNumber(item.getBatchNumber());
        resp.setExpiryDate(item.getExpiryDate());
        resp.setQuantityAvailable(item.getQuantityAvailable());
        resp.setUnit(item.getUnit());
        resp.setStorageCondition(item.getMedication().getStorageCondition());
        resp.setUnitPrice(item.getUnitPrice());
        resp.setLockStatus(item.getLockStatus());

        long days = ChronoUnit.DAYS.between(LocalDate.now(), item.getExpiryDate());
        resp.setExpiresInDays(days);
        resp.setBadgeColor(ExpiryUtil.computeBadge(days));

        return resp;
    }
}
