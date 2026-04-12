package com.dawaalink.controller;

import com.dawaalink.dto.CreateInventoryItemRequest;
import com.dawaalink.dto.InventoryItemResponse;
import com.dawaalink.security.SecurityContextUtil;
import com.dawaalink.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/inventory")
public class InventoryController {

    private final InventoryService inventoryService;
    private final SecurityContextUtil securityContext;

    public InventoryController(InventoryService inventoryService, SecurityContextUtil securityContext) {
        this.inventoryService = inventoryService;
        this.securityContext = securityContext;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('OWNER', 'PHARMACIST', 'EMPLOYEE')")
    public ResponseEntity<InventoryItemResponse> createListing(@Valid @RequestBody CreateInventoryItemRequest request) {
        UUID pharmacyId = securityContext.getCurrentPharmacyId();
        return ResponseEntity.status(HttpStatus.CREATED).body(inventoryService.addDeadStock(pharmacyId, request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('OWNER', 'PHARMACIST', 'EMPLOYEE')")
    public ResponseEntity<List<InventoryItemResponse>> getInventory() {
        UUID pharmacyId = securityContext.getCurrentPharmacyId();
        return ResponseEntity.ok(inventoryService.getPharmacyInventory(pharmacyId));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'PHARMACIST')")
    public ResponseEntity<InventoryItemResponse> updateListing(@PathVariable UUID id,
                                                               @RequestParam(required = false) Integer quantityAvailable,
                                                               @RequestParam(required = false) String notes) {
        UUID pharmacyId = securityContext.getCurrentPharmacyId();
        return ResponseEntity.ok(inventoryService.updateItem(id, pharmacyId, quantityAvailable, notes));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<Void> deleteListing(@PathVariable UUID id) {
        UUID pharmacyId = securityContext.getCurrentPharmacyId();
        inventoryService.deleteListing(id, pharmacyId);
        return ResponseEntity.noContent().build();
    }
}
