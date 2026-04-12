package com.dawaalink.repository;

import com.dawaalink.model.SwapCycle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

public interface SwapCycleRepository extends JpaRepository<SwapCycle, UUID> {
    List<SwapCycle> findByExecutionStatus(com.dawaalink.model.enums.ExecutionStatus status);
}
