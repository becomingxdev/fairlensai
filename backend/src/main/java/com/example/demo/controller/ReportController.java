package com.example.demo.controller;

import com.example.demo.entity.AuditReport;
import com.example.demo.repository.AuditReportRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final AuditReportRepository auditReportRepository;

    public ReportController(AuditReportRepository auditReportRepository) {
        this.auditReportRepository = auditReportRepository;
    }

    private String getAuthenticatedUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof String) {
            return (String) principal;
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<List<AuditReport>> getAllReports() {
        String userId = getAuthenticatedUserId();
        if (userId == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(auditReportRepository.findByUserId(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuditReport> getReport(@PathVariable Long id) {
        String userId = getAuthenticatedUserId();
        Optional<AuditReport> report = auditReportRepository.findById(id);
        
        if (report.isPresent() && report.get().getUserId().equals(userId)) {
            return ResponseEntity.ok(report.get());
        }
        return ResponseEntity.status(403).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        String userId = getAuthenticatedUserId();
        Optional<AuditReport> report = auditReportRepository.findById(id);
        
        if (report.isPresent() && report.get().getUserId().equals(userId)) {
            auditReportRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(403).build();
    }

    @GetMapping("/latest")
    public ResponseEntity<AuditReport> getLatestReport() {
        String userId = getAuthenticatedUserId();
        List<AuditReport> reports = auditReportRepository.findByUserId(userId);
        if (reports.isEmpty()) return ResponseEntity.notFound().build();
        
        return ResponseEntity.ok(reports.stream()
                .max((r1, r2) -> r1.getCreatedAt().compareTo(r2.getCreatedAt()))
                .get());
    }

    @GetMapping("/export/{id}")
    public ResponseEntity<String> exportReport(@PathVariable Long id) {
        String userId = getAuthenticatedUserId();
        Optional<AuditReport> report = auditReportRepository.findById(id);
        
        if (report.isPresent() && report.get().getUserId().equals(userId)) {
            // Return JSON details as a downloadable string
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"report_" + id + ".json\"")
                    .body(report.get().getDetailsJson());
        }
        return ResponseEntity.status(403).build();
    }
}