package com.dawaalink.repository;

import com.dawaalink.model.MedicationReference;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MedicationReferenceRepository extends JpaRepository<MedicationReference, String> {
    Optional<MedicationReference> findByTradeNameIgnoreCaseOrScientificNameIgnoreCase(String tradeName, String scientificName);
    java.util.List<MedicationReference> findByTradeNameContainingIgnoreCaseOrScientificNameContainingIgnoreCase(String tradeName, String scientificName);
}
