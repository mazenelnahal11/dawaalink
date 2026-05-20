package com.dawaalink.controller;

import com.dawaalink.exception.ResourceNotFoundException;
import com.dawaalink.model.Pharmacy;
import com.dawaalink.model.enums.PharmacyStatus;
import com.dawaalink.repository.PharmacyRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final PharmacyRepository pharmacyRepository;

    public AdminController(PharmacyRepository pharmacyRepository) {
        this.pharmacyRepository = pharmacyRepository;
    }

    @GetMapping("/pharmacies")
    public ResponseEntity<List<Pharmacy>> getPharmacies(@RequestParam PharmacyStatus status) {
        return ResponseEntity.ok(pharmacyRepository.findAllByStatus(status));
    }

    @PostMapping("/pharmacies/{id}/activate")
    public ResponseEntity<Void> activatePharmacy(@PathVariable UUID id) {
        Pharmacy pharmacy = pharmacyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pharmacy not found"));
        pharmacy.setStatus(PharmacyStatus.ACTIVE);
        pharmacyRepository.save(pharmacy);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/pharmacies/{id}/suspend")
    public ResponseEntity<Void> suspendPharmacy(@PathVariable UUID id) {
        Pharmacy pharmacy = pharmacyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pharmacy not found"));
        pharmacy.setStatus(PharmacyStatus.SUSPENDED);
        pharmacyRepository.save(pharmacy);
        return ResponseEntity.ok().build();
    }
}
