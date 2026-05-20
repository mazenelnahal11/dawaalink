package com.dawaalink.service;

import com.dawaalink.dto.CreateWishlistItemRequest;
import com.dawaalink.dto.WishlistItemResponse;
import com.dawaalink.exception.ResourceNotFoundException;
import com.dawaalink.model.MedicationReference;
import com.dawaalink.model.Pharmacy;
import com.dawaalink.model.WishlistItem;
import com.dawaalink.repository.MedicationReferenceRepository;
import com.dawaalink.repository.PharmacyRepository;
import com.dawaalink.repository.WishlistItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    private final WishlistItemRepository wishlistRepository;
    private final PharmacyRepository pharmacyRepository;
    private final MedicationReferenceRepository medicationRepository;

    public WishlistService(WishlistItemRepository wishlistRepository,
                           PharmacyRepository pharmacyRepository,
                           MedicationReferenceRepository medicationRepository) {
        this.wishlistRepository = wishlistRepository;
        this.pharmacyRepository = pharmacyRepository;
        this.medicationRepository = medicationRepository;
    }

    @Transactional
    public WishlistItemResponse addToWishlist(UUID pharmacyId, CreateWishlistItemRequest request) {
        Pharmacy pharmacy = pharmacyRepository.findById(pharmacyId)
                .orElseThrow(() -> new ResourceNotFoundException("Pharmacy not found"));

        MedicationReference med = null;
        if (request.getGtin() != null && !request.getGtin().isEmpty()) {
            med = medicationRepository.findById(request.getGtin()).orElse(null);
        }

        if (med == null) {
            med = medicationRepository.findByTradeNameIgnoreCaseOrScientificNameIgnoreCase(
                    request.getMedicineName(), request.getMedicineName()).stream().findFirst().orElse(null);
        }

        if (med == null) {
            med = new MedicationReference();
            med.setGtin(java.util.UUID.randomUUID().toString().substring(0, 14));
            med.setTradeName(request.getMedicineName());
            med.setScientificName(request.getMedicineName());
            med.setStorageCondition(com.dawaalink.model.enums.StorageCondition.ROOM_TEMP);
            med.setIsControlled(false);
            med = medicationRepository.save(med);
        }

        WishlistItem item = new WishlistItem();
        item.setPharmacy(pharmacy);
        item.setMedication(med);
        item.setQuantityNeeded(request.getQuantityNeeded());
        item.setMinAcceptableExpiry(request.getMinAcceptableExpiry());

        item = wishlistRepository.save(item);
        return mapToResponse(item);
    }

    public List<WishlistItemResponse> getWishlist(UUID pharmacyId) {
        return wishlistRepository.findByPharmacyId(pharmacyId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeFromWishlist(UUID pharmacyId, UUID wishlistId) {
        WishlistItem item = wishlistRepository.findById(wishlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist item not found"));

        if (!item.getPharmacy().getId().equals(pharmacyId)) {
            throw new SecurityException("Not authorized to remove this item");
        }

        wishlistRepository.delete(item);
    }

    private WishlistItemResponse mapToResponse(WishlistItem item) {
        WishlistItemResponse resp = new WishlistItemResponse();
        resp.setId(item.getId());
        resp.setMedicineName(item.getMedication().getTradeName());
        resp.setGtin(item.getMedication().getGtin());
        resp.setQuantityNeeded(item.getQuantityNeeded());
        resp.setMinAcceptableExpiry(item.getMinAcceptableExpiry());
        return resp;
    }
}
