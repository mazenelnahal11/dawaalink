package com.dawaalink.service;

import com.dawaalink.dto.DashboardKPI;
import com.dawaalink.model.enums.ExecutionStatus;
import com.dawaalink.repository.InventoryItemRepository;
import com.dawaalink.repository.SwapCycleRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class DashboardService {

    private final InventoryItemRepository inventoryRepository;
    private final SwapCycleRepository swapCycleRepository;

    public DashboardService(InventoryItemRepository inventoryRepository, SwapCycleRepository swapCycleRepository) {
        this.inventoryRepository = inventoryRepository;
        this.swapCycleRepository = swapCycleRepository;
    }

    public DashboardKPI getKPI(UUID pharmacyId) {
        long totalItems = inventoryRepository.countByPharmacyId(pharmacyId);
        long completedSwaps = swapCycleRepository.countByExecutionStatus(ExecutionStatus.COMPLETED);
        // Simplified logic for demo purposes: 
        // We'd ideally count only matches for THIS pharmacy this week.
        long matches = swapCycleRepository.countByExecutionStatus(ExecutionStatus.PENDING); 

        return new DashboardKPI(totalItems, matches, completedSwaps, 4500.00);
    }
}
