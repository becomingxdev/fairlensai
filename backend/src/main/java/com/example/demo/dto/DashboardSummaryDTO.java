package com.example.demo.dto;

import java.util.List;

public class DashboardSummaryDTO {
    private long totalUploads;
    private long totalAudits;
    private double avgFairnessScore;
    private double latestFairnessScore;
    private long highRiskCount;
    private long mediumRiskCount;
    private long lowRiskCount;

    public DashboardSummaryDTO() {}

    public long getTotalUploads() { return totalUploads; }
    public void setTotalUploads(long totalUploads) { this.totalUploads = totalUploads; }

    public long getTotalAudits() { return totalAudits; }
    public void setTotalAudits(long totalAudits) { this.totalAudits = totalAudits; }

    public double getAvgFairnessScore() { return avgFairnessScore; }
    public void setAvgFairnessScore(double avgFairnessScore) { this.avgFairnessScore = avgFairnessScore; }

    public double getLatestFairnessScore() { return latestFairnessScore; }
    public void setLatestFairnessScore(double latestFairnessScore) { this.latestFairnessScore = latestFairnessScore; }

    public long getHighRiskCount() { return highRiskCount; }
    public void setHighRiskCount(long highRiskCount) { this.highRiskCount = highRiskCount; }

    public long getMediumRiskCount() { return mediumRiskCount; }
    public void setMediumRiskCount(long mediumRiskCount) { this.mediumRiskCount = mediumRiskCount; }

    public long getLowRiskCount() { return lowRiskCount; }
    public void setLowRiskCount(long lowRiskCount) { this.lowRiskCount = lowRiskCount; }
}
