package com.dawaalink.controller;

import com.dawaalink.model.MedicationReference;
import com.dawaalink.repository.MedicationReferenceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/medications")
public class MedicationController {

    private final MedicationReferenceRepository medicationRepository;

    public MedicationController(MedicationReferenceRepository medicationRepository) {
        this.medicationRepository = medicationRepository;
    }

    @GetMapping
    public ResponseEntity<List<MedicationReference>> search(@RequestParam String q) {
        if (q.length() < 3) return ResponseEntity.ok(List.of());
        return ResponseEntity.ok(medicationRepository.findByTradeNameContainingIgnoreCaseOrScientificNameContainingIgnoreCase(q, q));
    }
}
