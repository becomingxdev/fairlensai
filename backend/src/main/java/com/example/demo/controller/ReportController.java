// package com.example.demo.controller;

// public class ReportController {
    
// }


package com.example.demo.controller;

import com.example.demo.entity.AuditReport;
import com.example.demo.repository.AuditReportRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    private final AuditReportRepository auditReportRepository;

    public ReportController(AuditReportRepository auditReportRepository) {
        this.auditReportRepository = auditReportRepository;
    }

    /**
     * Requirement: list reports [cite: 18]
     * Route: GET /api/reports [cite: 60]
     */
    @GetMapping
    public ResponseEntity<List<AuditReport>> getAllReports() {
        // Extract UID to ensure users only see their own history [cite: 6, 96]
        String uid = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(auditReportRepository.findByUserId(uid));
    }

    /**
     * Requirement: download report [cite: 19]
     * Route: GET /api/report/{id} [cite: 61]
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getReportById(@PathVariable Long id) {
        String uid = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return auditReportRepository.findById(id)
                .map(report -> {
                    // Security Check: Protected API logic
                    if (!report.getUserId().equals(uid)) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body("Access Denied: You do not own this report.");
                    }
                    return ResponseEntity.ok(report);
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}