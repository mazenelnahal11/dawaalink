package com.dawaalink.job;

import com.dawaalink.model.InventoryItem;
import com.dawaalink.model.SystemAlert;
import com.dawaalink.model.enums.LockStatus;
import com.dawaalink.repository.InventoryItemRepository;
import com.dawaalink.repository.SystemAlertRepository;
import com.dawaalink.util.ExpiryUtil;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class ExpiryAlertJob {

    private final InventoryItemRepository inventoryRepository;
    private final SystemAlertRepository alertRepository;

    public ExpiryAlertJob(InventoryItemRepository inventoryRepository, SystemAlertRepository alertRepository) {
        this.inventoryRepository = inventoryRepository;
        this.alertRepository = alertRepository;
    }

    /**
     * Scans ACTIVE inventory for near-expiry items and creates system alerts.
     * Runs daily at 2 AM.
     */
    @Scheduled(cron = "0 0 2 * * *")
    public void calculateExpiryBadges() {
        // Only scan ACTIVE items — avoids full table scan
        List<InventoryItem> activeItems = inventoryRepository.findByLockStatus(LockStatus.ACTIVE);

        LocalDate today = LocalDate.now();

        for (InventoryItem item : activeItems) {
            long days = ChronoUnit.DAYS.between(today, item.getExpiryDate());
            String alertType = ExpiryUtil.computeAlertType(days);

            if (alertType != null) {
                String message = "Item " + item.getMedication().getTradeName()
                        + " (Batch " + item.getBatchNumber() + ") expires in " + days + " days.";
                createAlert(alertType, message, item);
            }
        }
    }

    private void createAlert(String type, String message, InventoryItem item) {
        SystemAlert alert = new SystemAlert();
        alert.setType(type);
        alert.setMessage(message);
        alert.setRelatedEntityId(item.getPharmacy().getId());
        alertRepository.save(alert);
    }
}
