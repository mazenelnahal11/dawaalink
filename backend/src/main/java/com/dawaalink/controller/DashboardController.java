package com.dawaalink.controller;

import com.dawaalink.dto.DashboardKPI;
import com.dawaalink.security.SecurityContextUtil;
import com.dawaalink.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final SecurityContextUtil securityContext;

    public DashboardController(DashboardService dashboardService, SecurityContextUtil securityContext) {
        this.dashboardService = dashboardService;
        this.securityContext = securityContext;
    }

    @GetMapping
    public ResponseEntity<DashboardKPI> getKPI() {
        UUID pharmacyId = securityContext.getCurrentPharmacyId();
        return ResponseEntity.ok(dashboardService.getKPI(pharmacyId));
    }
}
