package com.example.demo.dto;

public class RecommendationDTO {
    private String priority;
    private String reportName;
    private String action;
    private String reasoning;
    private String date;
    private Long reportId;

    public RecommendationDTO(String priority, String reportName, String action, String reasoning, String date, Long reportId) {
        this.priority = priority;
        this.reportName = reportName;
        this.action = action;
        this.reasoning = reasoning;
        this.date = date;
        this.reportId = reportId;
    }

    public String getPriority() { return priority; }
    public String getReportName() { return reportName; }
    public String getAction() { return action; }
    public String getReasoning() { return reasoning; }
    public String getDate() { return date; }
    public Long getReportId() { return reportId; }
}
