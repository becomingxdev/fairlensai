package com.example.demo.service;

import com.example.demo.dto.AnalysisResultDTO;
import com.example.demo.dto.AnalysisResultDTO.FairnessMetricDTO;
import com.example.demo.dto.AnalysisResultDTO.GroupStatDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class BiasDetectionService {

    private static final Logger logger = LoggerFactory.getLogger(BiasDetectionService.class);

    public AnalysisResultDTO analyzeFairness(List<Map<String, String>> parsedData, 
                                           String protectedColumn, 
                                           String decisionColumn, 
                                           String groupA, 
                                           String groupB, 
                                           String approvalValue) {

        logger.info("Advanced bias analysis: {} comparing {} vs {} on {}", 
                protectedColumn, groupA, groupB, decisionColumn);

        long countA = 0, approvedA = 0;
        long countB = 0, approvedB = 0;

        for (Map<String, String> row : parsedData) {
            String protectedValue = row.getOrDefault(protectedColumn, "").trim();
            String decisionValue = row.getOrDefault(decisionColumn, "").trim();

            if (protectedValue.equalsIgnoreCase(groupA)) {
                countA++;
                if (decisionValue.equalsIgnoreCase(approvalValue)) {
                    approvedA++;
                }
            } else if (protectedValue.equalsIgnoreCase(groupB)) {
                countB++;
                if (decisionValue.equalsIgnoreCase(approvalValue)) {
                    approvedB++;
                }
            }
        }

        if (countA == 0 || countB == 0) {
            logger.error("Analysis failed: Insufficient data for groups {} or {}", groupA, groupB);
            throw new IllegalArgumentException("Insufficient data for groups " + groupA + " or " + groupB);
        }

        double rateA = (double) approvedA / countA;
        double rateB = (double) approvedB / countB;

        // 1. Disparate Impact Ratio (Standard: 4/5ths Rule)
        double impactRatio = (rateA == 0 && rateB == 0) ? 1.0 : (rateA > 0 ? rateB / rateA : 0.0);
        
        // 2. Statistical Parity Difference
        double statDiff = Math.abs(rateA - rateB);

        // 3. Representation Ratio
        double representationRatio = (double) Math.min(countA, countB) / Math.max(countA, countB);

        // Metrics List
        List<FairnessMetricDTO> metrics = new ArrayList<>();
        metrics.add(new FairnessMetricDTO(
            "Disparate Impact Ratio", 
            impactRatio, 
            0.8, 
            impactRatio >= 0.8 ? "Pass" : (impactRatio >= 0.6 ? "Warning" : "Fail"),
            "Compares the selection rate of the protected group to the reference group. Threshold 0.8."
        ));
        
        metrics.add(new FairnessMetricDTO(
            "Statistical Parity Difference", 
            statDiff, 
            0.1, 
            statDiff <= 0.1 ? "Pass" : "Fail",
            "The absolute difference between selection rates. Lower is better (Threshold 0.1)."
        ));

        metrics.add(new FairnessMetricDTO(
            "Representation Balance", 
            representationRatio, 
            0.5, 
            representationRatio >= 0.5 ? "Pass" : "Warning",
            "Measures balance between group sizes. (Ideal: > 0.5)"
        ));

        // Group Stats
        List<GroupStatDTO> groupStats = new ArrayList<>();
        groupStats.add(new GroupStatDTO(groupA, countA, approvedA, rateA));
        groupStats.add(new GroupStatDTO(groupB, countB, approvedB, rateB));

        // Fairness Score Calculation (0-100)
        double fairnessScore = calculateOverallScore(impactRatio, statDiff, representationRatio);
        
        // Severity
        String severity = determineSeverity(fairnessScore, impactRatio);

        // Summary & Warnings
        List<String> warnings = new ArrayList<>();
        if (impactRatio < 0.8) warnings.add("Disparate Impact detected: The 4/5ths rule is violated.");
        if (representationRatio < 0.3) warnings.add("Significant data imbalance: results may be statistically unreliable.");
        if (statDiff > 0.2) warnings.add("Large statistical gap between groups detected.");

        String summary = generateSummary(groupA, groupB, rateA, rateB, impactRatio, severity);

        // Recommendations
        List<String> recommendations = generateRecommendations(impactRatio, representationRatio, statDiff);

        return new AnalysisResultDTO(
            Math.round(fairnessScore * 10) / 10.0, 
            severity, 
            metrics, 
            groupStats, 
            warnings, 
            summary, 
            recommendations
        );
    }

    private double calculateOverallScore(double impact, double diff, double repr) {
        // Impact is most important (60%), then diff (30%), then representation (10%)
        // Normalized impact: if > 1.0, we treat it as 1.0 for score purposes (too much favor is also bias but usually ratio is < 1 for unprivileged)
        double normalizedImpact = Math.min(1.0, impact);
        double score = (normalizedImpact * 60) + ((1.0 - diff) * 30) + (repr * 10);
        return Math.max(0, Math.min(100, score));
    }

    private String determineSeverity(double score, double impact) {
        if (impact < 0.5 || score < 40) return "Critical";
        if (impact < 0.8 || score < 70) return "High";
        if (impact < 0.9 || score < 85) return "Medium";
        return "Low";
    }

    private String generateSummary(String gA, String gB, double rA, double rB, double ratio, String sev) {
        return String.format(
            "The analysis shows a %s risk of bias. %s has an approval rate of %.1f%%, while %s has %.1f%%. " +
            "The resulting impact ratio is %.2f, which is %s the industry standard 0.8 threshold.",
            sev.toLowerCase(), gA, rA * 100, gB, rB * 100, ratio, ratio >= 0.8 ? "above" : "below"
        );
    }

    private List<String> generateRecommendations(double impact, double repr, double diff) {
        List<String> recs = new ArrayList<>();
        if (impact < 0.8) {
            recs.add("Apply post-processing algorithms like 'Equalized Odds' or 'Reject Option Classification' to adjust decision thresholds.");
            recs.add("Audit individual features for high correlation with the protected attribute.");
        }
        if (repr < 0.5) {
            recs.add("Gather more representative data for " + (repr < 1.0 ? "the smaller group" : "minority classes") + ".");
        }
        if (diff > 0.15) {
            recs.add("Consider 'Reweighing' the samples to mitigate historical bias in the training set.");
        }
        if (recs.isEmpty()) {
            recs.add("Continue monitoring dataset distributions as new data arrives.");
        }
        return recs;
    }
}