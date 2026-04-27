// package com.example.demo.controller;

// public class DashboardController {
    
// }




package com.example.demo.controller;

import com.example.demo.dto.DashboardDTO;
import com.example.demo.entity.AuditReport;
import com.example.demo.repository.AuditReportRepository;
import com.example.demo.repository.DatasetRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final AuditReportRepository auditReportRepository;
    private final DatasetRepository datasetRepository;

    public DashboardController(AuditReportRepository auditReportRepository, DatasetRepository datasetRepository) {
        this.auditReportRepository = auditReportRepository;
        this.datasetRepository = datasetRepository;
    }

    @GetMapping
    public ResponseEntity<DashboardDTO> getDashboardData() {
        // 1. Identify the teammate currently logged in
        String uid = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 2. Fetch specific counts for this user
        List<AuditReport> userReports = auditReportRepository.findByUserId(uid);
        long totalDatasets = datasetRepository.findByUploadedByFirebaseUid(uid).size();
        long totalReports = userReports.size();

        // 3. Calculate Bias Stats
        long biasedCount = userReports.stream().filter(AuditReport::isBiased).count();

        double avgDisparity = userReports.stream()
                .mapToDouble(AuditReport::getDisparityRatio)
                .average()
                .orElse(0.0);

        // 4. Get the last 5 activities for the "Recent Activity" table
        List<AuditReport> recent = userReports.size() > 5
                ? userReports.subList(userReports.size() - 5, userReports.size())
                : userReports;

        DashboardDTO dashboard = new DashboardDTO(
                totalDatasets,
                totalReports,
                biasedCount,
                avgDisparity,
                recent);

        return ResponseEntity.ok(dashboard);
    }
}