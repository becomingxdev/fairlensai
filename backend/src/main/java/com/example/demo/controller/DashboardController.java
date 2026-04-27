package com.example.demo.controller;

import com.example.demo.dto.DashboardSummaryDTO;
import com.example.demo.dto.DistributionDTO;
import com.example.demo.dto.RecentReportDTO;
import com.example.demo.dto.TrendDataDTO;
import com.example.demo.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    private String getAuthenticatedUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof String) {
            return (String) principal;
        }
        return null;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDTO> getSummary() {
        String userId = getAuthenticatedUserId();
        if (userId == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(dashboardService.getSummary(userId));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<RecentReportDTO>> getRecentReports() {
        String userId = getAuthenticatedUserId();
        if (userId == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(dashboardService.getRecentReports(userId));
    }

    @GetMapping("/trends")
    public ResponseEntity<TrendDataDTO> getTrendData() {
        String userId = getAuthenticatedUserId();
        if (userId == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(dashboardService.getTrendData(userId));
    }

    @GetMapping("/distribution")
    public ResponseEntity<DistributionDTO> getDistribution() {
        String userId = getAuthenticatedUserId();
        if (userId == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(dashboardService.getDistribution(userId));
    }
}