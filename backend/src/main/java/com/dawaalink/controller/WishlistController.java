package com.dawaalink.controller;

import com.dawaalink.dto.CreateWishlistItemRequest;
import com.dawaalink.dto.WishlistItemResponse;
import com.dawaalink.security.SecurityContextUtil;
import com.dawaalink.service.WishlistService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;
    private final SecurityContextUtil securityContext;

    public WishlistController(WishlistService wishlistService, SecurityContextUtil securityContext) {
        this.wishlistService = wishlistService;
        this.securityContext = securityContext;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('OWNER', 'PHARMACIST', 'EMPLOYEE')")
    public ResponseEntity<WishlistItemResponse> add(@Valid @RequestBody CreateWishlistItemRequest request) {
        UUID pharmacyId = securityContext.getCurrentPharmacyId();
        return ResponseEntity.status(HttpStatus.CREATED).body(wishlistService.addToWishlist(pharmacyId, request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('OWNER', 'PHARMACIST', 'EMPLOYEE')")
    public ResponseEntity<List<WishlistItemResponse>> get() {
        UUID pharmacyId = securityContext.getCurrentPharmacyId();
        return ResponseEntity.ok(wishlistService.getWishlist(pharmacyId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'PHARMACIST', 'EMPLOYEE')")
    public ResponseEntity<Void> remove(@PathVariable UUID id) {
        UUID pharmacyId = securityContext.getCurrentPharmacyId();
        wishlistService.removeFromWishlist(pharmacyId, id);
        return ResponseEntity.noContent().build();
    }
}
