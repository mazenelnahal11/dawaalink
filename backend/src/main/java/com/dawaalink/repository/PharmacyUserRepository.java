package com.dawaalink.repository;

import com.dawaalink.model.PharmacyUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.Optional;

public interface PharmacyUserRepository extends JpaRepository<PharmacyUser, UUID> {
    Optional<PharmacyUser> findByEmail(String email);
}
