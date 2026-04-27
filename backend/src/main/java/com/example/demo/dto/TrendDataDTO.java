package com.example.demo.dto;

import java.util.List;

public class TrendDataDTO {
    private List<String> labels;
    private List<Double> scores;
    private List<Long> auditCounts;

    public TrendDataDTO(List<String> labels, List<Double> scores, List<Long> auditCounts) {
        this.labels = labels;
        this.scores = scores;
        this.auditCounts = auditCounts;
    }

    public List<String> getLabels() { return labels; }
    public List<Double> getScores() { return scores; }
    public List<Long> getAuditCounts() { return auditCounts; }
}
