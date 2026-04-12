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
import com.dawaalink.repository.SwapCycleRepository;
import com.dawaalink.repository.SwapLegRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.UUID;

@Service
public class DeliveryService {

    private static final int MAX_PIN_ATTEMPTS = 5;

    private final SwapLegRepository swapLegRepository;
    private final SwapCycleRepository swapCycleRepository;
    private final InventoryItemRepository inventoryRepository;
    private final AuditService auditService;
    private final PasswordEncoder passwordEncoder;

    public DeliveryService(SwapLegRepository swapLegRepository,
                           SwapCycleRepository swapCycleRepository,
                           InventoryItemRepository inventoryRepository,
                           AuditService auditService,
                           PasswordEncoder passwordEncoder) {
        this.swapLegRepository = swapLegRepository;
        this.swapCycleRepository = swapCycleRepository;
        this.inventoryRepository = inventoryRepository;
        this.auditService = auditService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public String deliver(UUID legId, UUID pharmacyId, String username) {
        SwapLeg leg = swapLegRepository.findById(legId)
                .orElseThrow(() -> new ResourceNotFoundException("Swap leg not found"));

        if (!leg.getSenderPharmacy().getId().equals(pharmacyId)) {
            throw new SecurityException("Unauthorized: sender only");
        }
        
        if (leg.getCycle().getExecutionStatus() != ExecutionStatus.CONFIRMED && 
            leg.getCycle().getExecutionStatus() != ExecutionStatus.IN_TRANSFER) {
            throw new BusinessRuleException("Cycle not confirmed or already complete");
        }

        if (leg.getLegStatus() != LegStatus.ACCEPTED) {
            throw new BusinessRuleException("Leg must be accepted first");
        }

        leg.getCycle().setExecutionStatus(ExecutionStatus.IN_TRANSFER);
        
        // Generate plaintext PIN to return to sender, store BCrypt hash
        String plaintextPin = generatePin(6);
        leg.setDeliveryPin(passwordEncoder.encode(plaintextPin));
        leg.setPinAttempts(0);
        
        auditService.logAction("SWAP_LEG", leg.getId(), "DELIVERY_INITIATED", username, "Supplier generated PIN");
        
        swapLegRepository.save(leg);
        swapCycleRepository.save(leg.getCycle());

        // Return plaintext PIN to the sender ONCE — it cannot be retrieved again
        return plaintextPin;
    }

    @Transactional
    public void receive(UUID legId, UUID pharmacyId, String pin, String username) {
        SwapLeg leg = swapLegRepository.findById(legId)
                .orElseThrow(() -> new ResourceNotFoundException("Swap leg not found"));

        if (!leg.getReceiverPharmacy().getId().equals(pharmacyId)) {
            throw new SecurityException("Unauthorized: receiver only");
        }

        // Rate limit PIN attempts
        if (leg.getPinAttempts() != null && leg.getPinAttempts() >= MAX_PIN_ATTEMPTS) {
            auditService.logAction("SWAP_LEG", leg.getId(), "PIN_LOCKED", username, 
                    "Exceeded " + MAX_PIN_ATTEMPTS + " PIN attempts");
            throw new SecurityException("PIN verification locked — too many failed attempts. Contact support.");
        }

        // Increment attempt counter BEFORE checking (prevents timing-based bypass)
        leg.setPinAttempts((leg.getPinAttempts() != null ? leg.getPinAttempts() : 0) + 1);
        swapLegRepository.save(leg);

        if (leg.getDeliveryPin() == null || !passwordEncoder.matches(pin, leg.getDeliveryPin())) {
            auditService.logAction("SWAP_LEG", leg.getId(), "PIN_FAILED", username, 
                    "Attempt " + leg.getPinAttempts() + " of " + MAX_PIN_ATTEMPTS);
            throw new BusinessRuleException("Invalid PIN. " + (MAX_PIN_ATTEMPTS - leg.getPinAttempts()) + " attempts remaining.");
        }

        // PIN valid — complete delivery
        leg.setPinAttempts(0);
        leg.setLegStatus(LegStatus.COMPLETED);
        auditService.logAction("SWAP_LEG", leg.getId(), "DELIVERY_RECEIVED", username, "Receiver validated PIN");
        
        swapLegRepository.save(leg);

        // Check if all legs in cycle are completed
        SwapCycle cycle = leg.getCycle();
        boolean allCompleted = true;
        for (SwapLeg l : cycle.getLegs()) {
            if (l.getLegStatus() != LegStatus.COMPLETED) {
                allCompleted = false;
                break;
            }
        }

        if (allCompleted) {
            cycle.setExecutionStatus(ExecutionStatus.COMPLETED);
            swapCycleRepository.save(cycle);
            auditService.logAction("SWAP_CYCLE", cycle.getId(), "COMPLETED", "SYSTEM", "Cycle all legs delivered");

            for (SwapLeg l : cycle.getLegs()) {
                InventoryItem item = l.getInventoryItem();
                item.setLockStatus(LockStatus.COMPLETED);
                item.setQuantityAvailable(item.getQuantityAvailable() - l.getQuantityTransferred());
                inventoryRepository.save(item);
                auditService.logAction("INVENTORY_ITEM", item.getId(), "FULFILLED", "SYSTEM", "Item officially transferred");
            }
        }
    }

    private String generatePin(int length) {
        SecureRandom random = new SecureRandom();
        StringBuilder pin = new StringBuilder();
        for (int i = 0; i < length; i++) {
            pin.append(random.nextInt(10));
        }
        return pin.toString();
    }
}
