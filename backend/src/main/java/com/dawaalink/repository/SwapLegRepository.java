package com.dawaalink.repository;

import com.dawaalink.model.SwapLeg;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

public interface SwapLegRepository extends JpaRepository<SwapLeg, UUID> {
    List<SwapLeg> findBySenderPharmacyIdOrReceiverPharmacyId(UUID senderId, UUID receiverId);
}
