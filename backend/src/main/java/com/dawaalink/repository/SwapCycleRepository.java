package com.dawaalink.repository;

import com.dawaalink.model.SwapCycle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

public interface SwapCycleRepository extends JpaRepository<SwapCycle, UUID> {
    List<SwapCycle> findByExecutionStatus(com.dawaalink.model.enums.ExecutionStatus status);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT c FROM SwapCycle c JOIN c.legs l WHERE l.senderPharmacy.id = :pharmacyId OR l.receiverPharmacy.id = :pharmacyId")
    List<SwapCycle> findAllByPharmacyId(@org.springframework.data.repository.query.Param("pharmacyId") UUID pharmacyId);

    long countByExecutionStatus(com.dawaalink.model.enums.ExecutionStatus status);
}
