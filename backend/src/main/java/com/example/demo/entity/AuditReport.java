package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_reports")
public class AuditReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String userId;
    private String fileName;
    private String targetColumn;
    private double disparityRatio;
    private boolean isBiased;

    @Column(columnDefinition = "TEXT")
    private String suggestions; // We'll store recommendations as a semicolon-separated string

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public String getFileName() {
        return fileName;
    }
    
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getTargetColumn() {
        return targetColumn;
    }

    public void setTargetColumn(String targetColumn) {
        this.targetColumn = targetColumn;
    }

    public double getDisparityRatio() {
        return disparityRatio;
    }

    public void setDisparityRatio(double disparityRatio) {
        this.disparityRatio = disparityRatio;
    }

    public boolean isBiased() {
        return isBiased;
    }

    public void setBiased(boolean biased) {
        isBiased = biased;
    }

    public String getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(String suggestions) {
        this.suggestions = suggestions;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}