package com.dawaalink.repository;

import com.dawaalink.model.InventoryItem;
import com.dawaalink.model.enums.LockStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, UUID>, JpaSpecificationExecutor<InventoryItem> {

    List<InventoryItem> findByPharmacyId(UUID pharmacyId);
    List<InventoryItem> findByPharmacyIdAndExpiryDateBefore(UUID pharmacyId, LocalDate date);
    long countByPharmacyId(UUID pharmacyId);
    List<InventoryItem> findByExpiryDateBefore(LocalDate date);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM InventoryItem i WHERE i.id IN :ids ORDER BY i.id")
    List<InventoryItem> findAllByIdInOrderById(@Param("ids") List<UUID> ids);

    List<InventoryItem> findByLockStatus(LockStatus status);

    /**
     * Eager-loads pharmacy and medication for batch operations
     * (matching engine, expiry alerts) to prevent N+1 queries.
     */
    @EntityGraph(attributePaths = {"pharmacy", "medication"})
    @Query("SELECT i FROM InventoryItem i WHERE i.lockStatus = :status")
    List<InventoryItem> findByLockStatusWithRelations(@Param("status") LockStatus status);
}
