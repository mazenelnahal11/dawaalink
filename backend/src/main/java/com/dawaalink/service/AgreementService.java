package com.dawaalink.service;

import com.dawaalink.exception.BusinessRuleException;
import com.dawaalink.exception.ResourceNotFoundException;
import com.dawaalink.model.InventoryItem;
import com.dawaalink.model.SwapCycle;
import com.dawaalink.model.SwapLeg;
import com.dawaalink.model.enums.ExecutionStatus;
import com.dawaalink.model.enums.LegStatus;
import com.dawaalink.model.enums.LockStatus;
import com.dawaalink.repository.InventoryItemRepository;
import com.dawaalink.repository.PharmacyRepository;
import com.dawaalink.repository.SwapCycleRepository;
import com.dawaalink.repository.SwapLegRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AgreementService {

    private final SwapCycleRepository swapCycleRepository;
    private final SwapLegRepository swapLegRepository;
    private final InventoryItemRepository inventoryRepository;
    private final PharmacyRepository pharmacyRepository;
    private final AuditService auditService;

    public AgreementService(SwapCycleRepository swapCycleRepository,
                            SwapLegRepository swapLegRepository,
                            InventoryItemRepository inventoryRepository,
                            PharmacyRepository pharmacyRepository,
                            AuditService auditService) {
        this.swapCycleRepository = swapCycleRepository;
        this.swapLegRepository = swapLegRepository;
        this.inventoryRepository = inventoryRepository;
        this.pharmacyRepository = pharmacyRepository;
        this.auditService = auditService;
    }

    @Transactional
    public void approveSwap(UUID cycleId, UUID pharmacyId, String username) {
        pharmacyRepository.findById(pharmacyId)
                .orElseThrow(() -> new ResourceNotFoundException("Pharmacy not found"));

        SwapCycle cycle = swapCycleRepository.findById(cycleId)
                .orElseThrow(() -> new ResourceNotFoundException("Cycle not found"));

        if (cycle.getExecutionStatus() == ExecutionStatus.CANCELLED ||
            cycle.getExecutionStatus() == ExecutionStatus.COMPLETED) {
            throw new BusinessRuleException("Cycle already finalized");
        }

        boolean foundAndApproved = false;
        boolean allApproved = true;

        for (SwapLeg leg : cycle.getLegs()) {
            if (leg.getSenderPharmacy().getId().equals(pharmacyId)) {
                leg.setLegStatus(LegStatus.ACCEPTED);
                foundAndApproved = true;
                auditService.logAction("SWAP_LEG", leg.getId(), "ACCEPTED", username,
                        "Pharmacy " + pharmacyId + " approved sending");
            }
            if (leg.getReceiverPharmacy().getId().equals(pharmacyId)) {
                leg.setLegStatus(LegStatus.ACCEPTED);
                foundAndApproved = true;
                auditService.logAction("SWAP_LEG", leg.getId(), "ACCEPTED", username,
                        "Pharmacy " + pharmacyId + " approved receiving");
            }
            if (leg.getLegStatus() != LegStatus.ACCEPTED) {
                allApproved = false;
            }
        }

        if (!foundAndApproved) {
            throw new BusinessRuleException("Pharmacy is not part of this swap cycle");
        }

        if (allApproved) {
            cycle.setExecutionStatus(ExecutionStatus.CONFIRMED);
            auditService.logAction("SWAP_CYCLE", cycle.getId(), "CONFIRMED", "SYSTEM",
                    "All parties approved cycle");

            for (SwapLeg leg : cycle.getLegs()) {
                InventoryItem item = leg.getInventoryItem();
                item.setLockStatus(LockStatus.LOCKED);
                inventoryRepository.save(item);
                auditService.logAction("INVENTORY_ITEM", item.getId(), "LOCKED_FOR_SWAP", "SYSTEM",
                        "Item confirmed for swap");
            }
        }

        swapCycleRepository.save(cycle);
    }

    @Transactional
    public void rejectSwap(UUID cycleId, UUID pharmacyId, String username) {
        pharmacyRepository.findById(pharmacyId)
                .orElseThrow(() -> new ResourceNotFoundException("Pharmacy not found"));

        SwapCycle cycle = swapCycleRepository.findById(cycleId)
                .orElseThrow(() -> new ResourceNotFoundException("Cycle not found"));

        if (cycle.getExecutionStatus() == ExecutionStatus.COMPLETED) {
            throw new BusinessRuleException("Cycle already completed");
        }

        cycle.setExecutionStatus(ExecutionStatus.CANCELLED);
        auditService.logAction("SWAP_CYCLE", cycle.getId(), "CANCELLED", username,
                "Pharmacy " + pharmacyId + " rejected cycle");

        for (SwapLeg leg : cycle.getLegs()) {
            leg.setLegStatus(LegStatus.DECLINED);
            InventoryItem item = leg.getInventoryItem();
            item.setLockStatus(LockStatus.ACTIVE);
            inventoryRepository.save(item);
            auditService.logAction("INVENTORY_ITEM", item.getId(), "UNLOCKED", "SYSTEM",
                    "Item reverted to ACTIVE due to swap rejection");
        }

        swapCycleRepository.save(cycle);
    }
}
