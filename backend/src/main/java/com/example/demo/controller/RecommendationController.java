package com.example.demo.controller;

import com.example.demo.dto.RecommendationDTO;
import com.example.demo.entity.AuditReport;
import com.example.demo.repository.AuditReportRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final AuditReportRepository auditReportRepository;

    public RecommendationController(AuditReportRepository auditReportRepository) {
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
    public ResponseEntity<List<RecommendationDTO>> getRecommendations() {
        String userId = getAuthenticatedUserId();
        if (userId == null) return ResponseEntity.status(401).build();

        List<AuditReport> reports = auditReportRepository.findByUserId(userId);
        List<RecommendationDTO> recommendations = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");

        for (AuditReport report : reports) {
            if (report.getSuggestions() != null && !report.getSuggestions().isEmpty()) {
                String[] suggestionList = report.getSuggestions().split(";");
                for (String suggestion : suggestionList) {
                    recommendations.add(new RecommendationDTO(
                            report.getSeverity(),
                            report.getFileName(),
                            suggestion.trim(),
                            "Based on " + report.getTargetColumn() + " analysis result of " + (int)report.getFairnessScore() + "%.",
                            report.getCreatedAt().format(formatter),
                            report.getId()
                    ));
                }
            }
        }

        // Sort by priority (Critical/High first)
        recommendations.sort((r1, r2) -> {
            int p1 = getPriorityWeight(r1.getPriority());
            int p2 = getPriorityWeight(r2.getPriority());
            return Integer.compare(p2, p1);
        });

        return ResponseEntity.ok(recommendations);
    }

    private int getPriorityWeight(String priority) {
        switch (priority) {
            case "Critical": return 4;
            case "High": return 3;
            case "Medium": return 2;
            case "Low": return 1;
            default: return 0;
        }
    }
}
