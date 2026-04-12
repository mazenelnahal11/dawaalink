package com.dawaalink.controller;

import com.dawaalink.security.SecurityContextUtil;
import com.dawaalink.service.DeliveryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/swaps")
public class DeliveryController {

    private final DeliveryService deliveryService;
    private final SecurityContextUtil securityContext;

    public DeliveryController(DeliveryService deliveryService, SecurityContextUtil securityContext) {
        this.deliveryService = deliveryService;
        this.securityContext = securityContext;
    }

    @PostMapping("/leg/{legId}/deliver")
    @PreAuthorize("hasAnyRole('OWNER', 'PHARMACIST')")
    public ResponseEntity<Map<String, String>> deliver(@PathVariable UUID legId) {
        UUID pharmacyId = securityContext.getCurrentPharmacyId();
        String username = securityContext.getCurrentUsername();
        String pin = deliveryService.deliver(legId, pharmacyId, username);
        return ResponseEntity.ok(Map.of("deliveryPin", pin));
    }

    @PostMapping("/leg/{legId}/receive")
    @PreAuthorize("hasAnyRole('OWNER', 'PHARMACIST')")
    public ResponseEntity<Void> receive(@PathVariable UUID legId,
                                        @RequestBody Map<String, String> body) {
        UUID pharmacyId = securityContext.getCurrentPharmacyId();
        String username = securityContext.getCurrentUsername();
        String pin = body.get("pin");
        if (pin == null || pin.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        deliveryService.receive(legId, pharmacyId, pin, username);
        return ResponseEntity.ok().build();
    }
}
