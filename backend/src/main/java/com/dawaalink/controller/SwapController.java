package com.dawaalink.controller;

import com.dawaalink.dto.SwapCycleResponse;
import com.dawaalink.security.SecurityContextUtil;
import com.dawaalink.service.AgreementService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/swaps")
public class SwapController {

    private final AgreementService agreementService;
    private final SecurityContextUtil securityContext;

    public SwapController(AgreementService agreementService, SecurityContextUtil securityContext) {
        this.agreementService = agreementService;
        this.securityContext = securityContext;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('OWNER', 'PHARMACIST', 'EMPLOYEE')")
    public ResponseEntity<List<SwapCycleResponse>> getSwaps() {
        UUID pharmacyId = securityContext.getCurrentPharmacyId();
        return ResponseEntity.ok(agreementService.getPharmacySwaps(pharmacyId));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('OWNER', 'PHARMACIST')")
    public ResponseEntity<Void> approveSwap(@PathVariable UUID id) {
        UUID pharmacyId = securityContext.getCurrentPharmacyId();
        String username = securityContext.getCurrentUsername();
        agreementService.approveSwap(id, pharmacyId, username);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('OWNER', 'PHARMACIST')")
    public ResponseEntity<Void> rejectSwap(@PathVariable UUID id) {
        UUID pharmacyId = securityContext.getCurrentPharmacyId();
        String username = securityContext.getCurrentUsername();
        agreementService.rejectSwap(id, pharmacyId, username);
        return ResponseEntity.ok().build();
    }
}
