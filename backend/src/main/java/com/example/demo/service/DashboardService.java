package com.example.demo.service;

import com.example.demo.dto.DashboardSummaryDTO;
import com.example.demo.dto.DistributionDTO;
import com.example.demo.dto.RecentReportDTO;
import com.example.demo.dto.TrendDataDTO;
import com.example.demo.entity.AuditReport;
import com.example.demo.entity.Dataset;
import com.example.demo.repository.AuditReportRepository;
import com.example.demo.repository.DatasetRepository;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final AuditReportRepository auditReportRepository;
    private final DatasetRepository datasetRepository;

    public DashboardService(AuditReportRepository auditReportRepository, DatasetRepository datasetRepository) {
        this.auditReportRepository = auditReportRepository;
        this.datasetRepository = datasetRepository;
    }

    public DashboardSummaryDTO getSummary(String userId) {
        List<AuditReport> reports = auditReportRepository.findByUserId(userId);
        List<Dataset> datasets = datasetRepository.findByUploadedByFirebaseUid(userId);

        DashboardSummaryDTO summary = new DashboardSummaryDTO();
        summary.setTotalUploads(datasets.size());
        summary.setTotalAudits(reports.size());

        if (!reports.isEmpty()) {
            double avgScore = reports.stream()
                    .mapToDouble(AuditReport::getFairnessScore)
                    .average()
                    .orElse(0.0);
            summary.setAvgFairnessScore(Math.round(avgScore * 10.0) / 10.0);

            AuditReport latest = reports.stream()
                    .max(Comparator.comparing(AuditReport::getCreatedAt))
                    .get();
            summary.setLatestFairnessScore(latest.getFairnessScore());

            summary.setHighRiskCount(reports.stream().filter(r -> "High".equals(r.getSeverity()) || "Critical".equals(r.getSeverity())).count());
            summary.setMediumRiskCount(reports.stream().filter(r -> "Medium".equals(r.getSeverity())).count());
            summary.setLowRiskCount(reports.stream().filter(r -> "Low".equals(r.getSeverity())).count());
        }

        return summary;
    }

    public List<RecentReportDTO> getRecentReports(String userId) {
        List<AuditReport> reports = auditReportRepository.findByUserId(userId);
        return reports.stream()
                .sorted(Comparator.comparing(AuditReport::getCreatedAt).reversed())
                .limit(5)
                .map(r -> new RecentReportDTO(
                        r.getFileName(),
                        r.getCreatedAt(),
                        r.getFairnessScore(),
                        r.getSeverity(),
                        r.getTargetColumn()
                ))
                .collect(Collectors.toList());
    }

    public TrendDataDTO getTrendData(String userId) {
        List<AuditReport> reports = auditReportRepository.findByUserId(userId);
        
        // Group by date (simplistic implementation for MVP)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");
        Map<String, List<AuditReport>> groupedByDate = reports.stream()
                .sorted(Comparator.comparing(AuditReport::getCreatedAt))
                .collect(Collectors.groupingBy(
                        r -> r.getCreatedAt().format(formatter),
                        LinkedHashMap::new,
                        Collectors.toList()
                ));

        List<String> labels = new ArrayList<>(groupedByDate.keySet());
        List<Double> scores = groupedByDate.values().stream()
                .map(list -> list.stream().mapToDouble(AuditReport::getFairnessScore).average().orElse(0.0))
                .map(v -> Math.round(v * 10.0) / 10.0)
                .collect(Collectors.toList());
        List<Long> auditCounts = groupedByDate.values().stream()
                .map(list -> (long) list.size())
                .collect(Collectors.toList());

        return new TrendDataDTO(labels, scores, auditCounts);
    }

    public DistributionDTO getDistribution(String userId) {
        List<AuditReport> reports = auditReportRepository.findByUserId(userId);

        Map<String, Long> severityBreakdown = reports.stream()
                .collect(Collectors.groupingBy(AuditReport::getSeverity, Collectors.counting()));

        Map<String, Double> avgScoreByAttribute = reports.stream()
                .collect(Collectors.groupingBy(
                        AuditReport::getTargetColumn,
                        Collectors.averagingDouble(AuditReport::getFairnessScore)
                ));

        return new DistributionDTO(severityBreakdown, avgScoreByAttribute);
    }
}
