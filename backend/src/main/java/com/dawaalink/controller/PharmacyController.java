package com.dawaalink.controller;

import com.dawaalink.security.SecurityContextUtil;
import com.dawaalink.service.PharmacyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/pharmacies")
public class PharmacyController {

    private final PharmacyService pharmacyService;
    private final SecurityContextUtil securityContext;

    public PharmacyController(PharmacyService pharmacyService, SecurityContextUtil securityContext) {
        this.pharmacyService = pharmacyService;
        this.securityContext = securityContext;
    }

    @PatchMapping("/profile-image")
    @PreAuthorize("hasAnyRole('OWNER', 'PHARMACIST')")
    public ResponseEntity<Map<String, String>> updateProfileImage(@RequestBody Map<String, String> request) {
        UUID pharmacyId = securityContext.getCurrentPharmacyId();
        String imageUrl = request.get("imageUrl");
        pharmacyService.updateProfileImage(pharmacyId, imageUrl);
        return ResponseEntity.ok(Map.of("profileImageUrl", imageUrl));
    }
}
