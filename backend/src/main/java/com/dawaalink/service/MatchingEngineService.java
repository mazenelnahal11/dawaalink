package com.dawaalink.service;

import com.dawaalink.model.InventoryItem;
import com.dawaalink.model.Pharmacy;
import com.dawaalink.model.SwapCycle;
import com.dawaalink.model.SwapLeg;
import com.dawaalink.model.WishlistItem;
import com.dawaalink.model.enums.ExecutionStatus;
import com.dawaalink.model.enums.LegStatus;
import com.dawaalink.model.enums.LockStatus;
import com.dawaalink.repository.InventoryItemRepository;
import com.dawaalink.repository.SwapCycleRepository;
import com.dawaalink.repository.SwapLegRepository;
import com.dawaalink.repository.WishlistItemRepository;
import com.dawaalink.util.HaversineUtil;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MatchingEngineService {

    private static final double MAX_DISTANCE_KM = 10.0;

    private final InventoryItemRepository inventoryRepository;
    private final WishlistItemRepository wishlistRepository;
    private final SwapCycleRepository swapCycleRepository;
    private final SwapLegRepository swapLegRepository;

    public MatchingEngineService(InventoryItemRepository inventoryRepository,
                                 WishlistItemRepository wishlistRepository,
                                 SwapCycleRepository swapCycleRepository,
                                 SwapLegRepository swapLegRepository) {
        this.inventoryRepository = inventoryRepository;
        this.wishlistRepository = wishlistRepository;
        this.swapCycleRepository = swapCycleRepository;
        this.swapLegRepository = swapLegRepository;
    }

    /**
     * Core matching loop. Runs every 30 minutes.
     *
     * OPTIMIZATION: Wishlists are indexed by GTIN in a HashMap,
     * turning the O(n*m) nested loop into O(n+m) amortized.
     */
    @Scheduled(cron = "0 0/30 * * * *")
    @Transactional
    public void runMatchingCycle() {
        // Use @EntityGraph query to eager-load pharmacy + medication in one query (no N+1)
        List<InventoryItem> activeInventory = inventoryRepository.findByLockStatusWithRelations(LockStatus.ACTIVE);
        if (activeInventory.isEmpty()) return;

        List<WishlistItem> activeWishlists = wishlistRepository.findAll();
        if (activeWishlists.isEmpty()) return;

        // Index wishlists by GTIN for O(1) lookup instead of O(m) inner loop
        Map<String, List<WishlistItem>> wishlistByGtin = new HashMap<>();
        for (WishlistItem w : activeWishlists) {
            if (w.getMedication() == null) continue;
            String gtin = w.getMedication().getGtin();
            if (gtin != null) {
                wishlistByGtin.computeIfAbsent(gtin, k -> new ArrayList<>()).add(w);
            }
        }

        // Build edges: A -> B means Pharmacy A HAS what Pharmacy B WANTS
        List<SwapEdge> edges = new ArrayList<>();

        for (InventoryItem item : activeInventory) {
            if (item.getMedication() == null) continue;
            String gtin = item.getMedication().getGtin();
            if (gtin == null) continue;

            List<WishlistItem> matchingWishlists = wishlistByGtin.getOrDefault(gtin, Collections.emptyList());

            for (WishlistItem w : matchingWishlists) {
                if (item.getPharmacy().getId().equals(w.getPharmacy().getId())) {
                    continue; // Same pharmacy
                }

                Pharmacy supplier = item.getPharmacy();
                Pharmacy receiver = w.getPharmacy();

                if (isWithinRadius(supplier, receiver)) {
                    edges.add(new SwapEdge(supplier, receiver, item, w));
                }
            }
        }

        detectAndExecuteCycles(edges);
    }

    private boolean isWithinRadius(Pharmacy a, Pharmacy b) {
        BigDecimal latA = a.getLatitude();
        BigDecimal lonA = a.getLongitude();
        BigDecimal latB = b.getLatitude();
        BigDecimal lonB = b.getLongitude();

        // If coordinates are missing, allow match (for dev/testing)
        if (latA == null || lonA == null || latB == null || lonB == null) return true;
        if (latA.equals(BigDecimal.ZERO) && lonA.equals(BigDecimal.ZERO)) return true;

        double dist = HaversineUtil.calculateDistance(latA, lonA, latB, lonB);
        return dist <= MAX_DISTANCE_KM;
    }

    private void detectAndExecuteCycles(List<SwapEdge> edges) {
        // Group edges by supplier pharmacy for adjacency list
        Map<UUID, List<SwapEdge>> graph = new HashMap<>();
        for (SwapEdge e : edges) {
            graph.computeIfAbsent(e.supplier.getId(), k -> new ArrayList<>()).add(e);
        }

        Set<UUID> executedItems = new HashSet<>();

        // Detect 2-party cycles
        for (SwapEdge e1 : edges) {
            if (executedItems.contains(e1.inventoryItem.getId())) continue;

            for (SwapEdge e2 : graph.getOrDefault(e1.receiver.getId(), Collections.emptyList())) {
                if (executedItems.contains(e2.inventoryItem.getId())) continue;

                if (e2.receiver.getId().equals(e1.supplier.getId())) {
                    if (lockAndCreateCycle(List.of(e1, e2))) {
                        executedItems.add(e1.inventoryItem.getId());
                        executedItems.add(e2.inventoryItem.getId());
                    }
                }
            }
        }

        // Detect 3-party cycles
        for (SwapEdge e1 : edges) {
            if (executedItems.contains(e1.inventoryItem.getId())) continue;

            for (SwapEdge e2 : graph.getOrDefault(e1.receiver.getId(), Collections.emptyList())) {
                if (executedItems.contains(e2.inventoryItem.getId())) continue;

                for (SwapEdge e3 : graph.getOrDefault(e2.receiver.getId(), Collections.emptyList())) {
                    if (executedItems.contains(e3.inventoryItem.getId())) continue;

                    if (e3.receiver.getId().equals(e1.supplier.getId())) {
                        if (lockAndCreateCycle(List.of(e1, e2, e3))) {
                            executedItems.add(e1.inventoryItem.getId());
                            executedItems.add(e2.inventoryItem.getId());
                            executedItems.add(e3.inventoryItem.getId());
                        }
                    }
                }
            }
        }
    }

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public boolean lockAndCreateCycle(List<SwapEdge> cycleEdges) {
        List<UUID> itemIds = cycleEdges.stream()
                .map(e -> e.inventoryItem.getId())
                .collect(Collectors.toList());

        // Pessimistic lock to prevent concurrent matching
        List<InventoryItem> lockedItems = inventoryRepository.findAllByIdInOrderById(itemIds);

        if (lockedItems.size() != itemIds.size()) return false;

        for (InventoryItem item : lockedItems) {
            if (item.getLockStatus() != LockStatus.ACTIVE) {
                return false; // Already locked by another cycle
            }
        }

        // Apply locks
        for (InventoryItem item : lockedItems) {
            item.setLockStatus(LockStatus.LOCKED);
        }
        inventoryRepository.saveAll(lockedItems);

        // Create cycle
        SwapCycle cycle = new SwapCycle();
        cycle.setExecutionStatus(ExecutionStatus.PENDING);
        cycle.setExpiresAt(LocalDateTime.now().plusHours(72));
        cycle = swapCycleRepository.save(cycle);

        for (SwapEdge edge : cycleEdges) {
            SwapLeg leg = new SwapLeg();
            leg.setCycle(cycle);
            leg.setSenderPharmacy(edge.supplier);
            leg.setReceiverPharmacy(edge.receiver);
            leg.setInventoryItem(edge.inventoryItem);
            leg.setLegStatus(LegStatus.PENDING);
            leg.setQuantityTransferred(1);
            swapLegRepository.save(leg);

            wishlistRepository.delete(edge.wishlistItem);
        }
        return true;
    }

    /**
     * Internal edge representation for the matching graph.
     */
    private static class SwapEdge {
        final Pharmacy supplier;
        final Pharmacy receiver;
        final InventoryItem inventoryItem;
        final WishlistItem wishlistItem;

        SwapEdge(Pharmacy supplier, Pharmacy receiver, InventoryItem inventoryItem, WishlistItem wishlistItem) {
            this.supplier = supplier;
            this.receiver = receiver;
            this.inventoryItem = inventoryItem;
            this.wishlistItem = wishlistItem;
        }
    }
}
