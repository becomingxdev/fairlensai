package com.example.demo.dto;

import java.util.List;

public class AnalysisResultDTO {
    private double fairnessScore;
    private String severity; // Low, Medium, High, Critical
    private List<FairnessMetricDTO> metrics;
    private List<GroupStatDTO> groupStats;
    private List<String> warnings;
    private String summary;
    private List<String> recommendations;

    public AnalysisResultDTO() {
    }

    public AnalysisResultDTO(double fairnessScore, String severity, List<FairnessMetricDTO> metrics,
            List<GroupStatDTO> groupStats, List<String> warnings,
            String summary, List<String> recommendations) {
        this.fairnessScore = fairnessScore;
        this.severity = severity;
        this.metrics = metrics;
        this.groupStats = groupStats;
        this.warnings = warnings;
        this.summary = summary;
        this.recommendations = recommendations;
    }

    // Getters and Setters
    public double getFairnessScore() {
        return fairnessScore;
    }

    public void setFairnessScore(double fairnessScore) {
        this.fairnessScore = fairnessScore;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public List<FairnessMetricDTO> getMetrics() {
        return metrics;
    }

    public void setMetrics(List<FairnessMetricDTO> metrics) {
        this.metrics = metrics;
    }

    public List<GroupStatDTO> getGroupStats() {
        return groupStats;
    }

    public void setGroupStats(List<GroupStatDTO> groupStats) {
        this.groupStats = groupStats;
    }

    public List<String> getWarnings() {
        return warnings;
    }

    public void setWarnings(List<String> warnings) {
        this.warnings = warnings;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public List<String> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<String> recommendations) {
        this.recommendations = recommendations;
    }

    public static class FairnessMetricDTO {
        private String name;
        private double value;
        private double threshold;
        private String status; // Pass, Fail, Warning
        private String description;

        public FairnessMetricDTO(String name, double value, double threshold, String status, String description) {
            this.name = name;
            this.value = value;
            this.threshold = threshold;
            this.status = status;
            this.description = description;
        }

        public String getName() {
            return name;
        }

        public double getValue() {
            return value;
        }

        public double getThreshold() {
            return threshold;
        }

        public String getStatus() {
            return status;
        }

        public String getDescription() {
            return description;
        }
    }

    public static class GroupStatDTO {
        private String name;
        private long totalCount;
        private long approvedCount;
        private double approvalRate;

        public GroupStatDTO(String name, long totalCount, long approvedCount, double approvalRate) {
            this.name = name;
            this.totalCount = totalCount;
            this.approvedCount = approvedCount;
            this.approvalRate = approvalRate;
        }

        public String getName() {
            return name;
        }

        public long getTotalCount() {
            return totalCount;
        }

        public long getApprovedCount() {
            return approvedCount;
        }

        public double getApprovalRate() {
            return approvalRate;
        }
    }
}
