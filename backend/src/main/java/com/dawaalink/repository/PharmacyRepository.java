package com.dawaalink.repository;

import com.dawaalink.model.Pharmacy;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.Optional;

public interface PharmacyRepository extends JpaRepository<Pharmacy, UUID> {
    Optional<Pharmacy> findByTaxId(String taxId);
}
