package com.example.demo.dto;

public class AnalysisRequestDTO {
    private String targetColumn;
    private String protectedColumn;
    private String groupA;
    private String groupB;

    // Getters and Setters
    public String getTargetColumn() {
        return targetColumn;
    }

    public void setTargetColumn(String targetColumn) {
        this.targetColumn = targetColumn;
    }

    public String getProtectedColumn() {
        return protectedColumn;
    }

    public void setProtectedColumn(String protectedColumn) {
        this.protectedColumn = protectedColumn;
    }

    public String getGroupA() {
        return groupA;
    }

    public void setGroupA(String groupA) {
        this.groupA = groupA;
    }

    public String getGroupB() {
        return groupB;
    }

    public void setGroupB(String groupB) {
        this.groupB = groupB;
    }
}
