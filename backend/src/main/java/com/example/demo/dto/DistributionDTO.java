package com.example.demo.dto;

import java.util.Map;

public class DistributionDTO {
    private Map<String, Long> severityBreakdown;
    private Map<String, Double> avgScoreByAttribute;

    public DistributionDTO(Map<String, Long> severityBreakdown, Map<String, Double> avgScoreByAttribute) {
        this.severityBreakdown = severityBreakdown;
        this.avgScoreByAttribute = avgScoreByAttribute;
    }

    public Map<String, Long> getSeverityBreakdown() { return severityBreakdown; }
    public Map<String, Double> getAvgScoreByAttribute() { return avgScoreByAttribute; }
}
