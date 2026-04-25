// package com.example.demo.dto;

// public class DashboardDTO {
    
// }


package com.example.demo.dto;

import com.example.demo.entity.AuditReport;
import java.util.List;

public class DashboardDTO {
    private long totalDatasets;
    private long totalReports;
    private long biasedReportsCount;
    private double averageDisparity;
    private List<AuditReport> recentActivities;

    public DashboardDTO(long totalDatasets, long totalReports, long biasedReportsCount,
            double averageDisparity, List<AuditReport> recentActivities) {
        this.totalDatasets = totalDatasets;
        this.totalReports = totalReports;
        this.biasedReportsCount = biasedReportsCount;
        this.averageDisparity = averageDisparity;
        this.recentActivities = recentActivities;
    }

    // Getters
    public long getTotalDatasets() {
        return totalDatasets;
    }

    public long getTotalReports() {
        return totalReports;
    }

    public long getBiasedReportsCount() {
        return biasedReportsCount;
    }

    public double getAverageDisparity() {
        return averageDisparity;
    }

    public List<AuditReport> getRecentActivities() {
        return recentActivities;
    }
}