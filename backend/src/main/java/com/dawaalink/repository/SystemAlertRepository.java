package com.dawaalink.repository;

import com.dawaalink.model.SystemAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

public interface SystemAlertRepository extends JpaRepository<SystemAlert, UUID> {
    List<SystemAlert> findByIsReadFalse();
}
