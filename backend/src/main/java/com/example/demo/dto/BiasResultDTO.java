// package com.example.demo.dto;

// public class BiasResultDTO {
//     private String groupName;
//     private double groupAApprovalRate;
//     private double groupBApprovalRate;
//     private double disparityRatio;
//     private boolean isBiased;

//     public BiasResultDTO(String groupName, double groupAApprovalRate, double groupBApprovalRate,
//             double disparityRatio) {
//         this.groupName = groupName;
//         this.groupAApprovalRate = groupAApprovalRate;
//         this.groupBApprovalRate = groupBApprovalRate;
//         this.disparityRatio = disparityRatio;
//         // The industry standard 80% rule: If the ratio is under 0.8, flag it as biased
//         this.isBiased = disparityRatio < 0.8;
//     }

//     public String getGroupName() {
//         return groupName;
//     }

//     public double getGroupAApprovalRate() {
//         return groupAApprovalRate;
//     }

//     public double getGroupBApprovalRate() {
//         return groupBApprovalRate;
//     }

//     public double getDisparityRatio() {
//         return disparityRatio;
//     }

//     public boolean isBiased() {
//         return isBiased;
//     }
// }



package com.example.demo.dto;

import java.util.List;

public class BiasResultDTO {
    private String groupName;
    private double groupAApprovalRate;
    private double groupBApprovalRate;
    private double disparityRatio;
    private boolean isBiased;
    private List<String> recommendations; // NEW: Added this field

    // Updated Constructor: Keeps your original logic but accepts the
    // recommendations list
    public BiasResultDTO(String groupName, double groupAApprovalRate, double groupBApprovalRate,
            double disparityRatio, List<String> recommendations) {
        this.groupName = groupName;
        this.groupAApprovalRate = groupAApprovalRate;
        this.groupBApprovalRate = groupBApprovalRate;
        this.disparityRatio = disparityRatio;
        // The industry standard 80% rule: If the ratio is under 0.8, flag it as biased
        this.isBiased = disparityRatio < 0.8;
        this.recommendations = recommendations; // NEW: Initialize the list
    }

    public String getGroupName() {
        return groupName;
    }

    public double getGroupAApprovalRate() {
        return groupAApprovalRate;
    }

    public double getGroupBApprovalRate() {
        return groupBApprovalRate;
    }

    public double getDisparityRatio() {
        return disparityRatio;
    }

    public boolean isBiased() {
        return isBiased;
    }

    // NEW: Getter for the recommendations
    public List<String> getRecommendations() {
        return recommendations;
    }
}