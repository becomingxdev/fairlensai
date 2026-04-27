package com.example.demo.dto;

import java.time.LocalDateTime;

public class RecentReportDTO {
    private String fileName;
    private LocalDateTime date;
    private double score;
    private String severity;
    private String protectedAttribute;

    public RecentReportDTO(String fileName, LocalDateTime date, double score, String severity, String protectedAttribute) {
        this.fileName = fileName;
        this.date = date;
        this.score = score;
        this.severity = severity;
        this.protectedAttribute = protectedAttribute;
    }

    public String getFileName() { return fileName; }
    public LocalDateTime getDate() { return date; }
    public double getScore() { return score; }
    public String getSeverity() { return severity; }
    public String getProtectedAttribute() { return protectedAttribute; }
}
