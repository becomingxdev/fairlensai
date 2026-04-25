package com.example.demo.service;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class RecommendationService {

    public List<String> generateRecommendations(double disparityRatio, String disadvantagedGroup) {
        List<String> recommendations = new ArrayList<>();

        if (disparityRatio >= 0.8) {
            recommendations.add("Success: The model is within fair boundaries.");
            recommendations.add("Recommendation: Maintain current data collection methods.");
            return recommendations;
        }

        // If biased, give these specific tips
        recommendations.add("Warning: Significant Bias detected against " + disadvantagedGroup);
        recommendations.add("Action: Check if " + disadvantagedGroup + " is underrepresented in the training data.");
        recommendations.add("Action: Review model features to ensure they aren't proxies for " + disadvantagedGroup);

        return recommendations;
    }
}