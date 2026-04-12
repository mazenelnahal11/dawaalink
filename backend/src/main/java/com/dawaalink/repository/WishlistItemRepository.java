package com.dawaalink.repository;

import com.dawaalink.model.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, UUID> {
    List<WishlistItem> findByPharmacyId(UUID pharmacyId);
}
