// package com.example.demo.service;

// import com.example.demo.dto.BiasResultDTO;
// import org.springframework.stereotype.Service;
// import java.util.List;
// import java.util.Map;

// @Service
// public class BiasDetectionService {

//     public BiasResultDTO analyzeFairness(List<Map<String, String>> parsedData, String targetColumn, String groupA,
//             String groupB) {

//         double groupATotal = 0;
//         double groupAApproved = 0;
//         double groupBTotal = 0;
//         double groupBApproved = 0;

//         for (Map<String, String> row : parsedData) {
//             String groupValue = row.getOrDefault(targetColumn, "").trim();
//             String status = row.getOrDefault("selected / rejected", "").trim().toLowerCase();

//             if (groupValue.equalsIgnoreCase(groupA)) {
//                 groupATotal++;
//                 if (status.equals("selected")) {
//                     groupAApproved++;
//                 }
//             } else if (groupValue.equalsIgnoreCase(groupB)) {
//                 groupBTotal++;
//                 if (status.equals("selected")) {
//                     groupBApproved++;
//                 }
//             }
//         }

//         if (groupATotal == 0 || groupBTotal == 0) {
//             throw new IllegalArgumentException("Not enough data to compare " + groupA + " and " + groupB);
//         }

//         double rateA = groupAApproved / groupATotal;
//         double rateB = groupBApproved / groupBTotal;

//         double disparityRatio;
//         if (rateA == 0 && rateB == 0) {
//             disparityRatio = 1.0;
//         } else if (rateA < rateB) {
//             disparityRatio = rateA / rateB;
//         } else {
//             disparityRatio = rateB / rateA;
//         }

//         // return new BiasResultDTO(targetColumn, rateA, rateB, disparityRatio);

//         // Change the last line of the analyzeFairness method to this:
//         return new BiasResultDTO(targetColumn, rateA, rateB, disparityRatio, null);
//     }
// }


package com.example.demo.service;

import com.example.demo.dto.BiasResultDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class BiasDetectionService {

    // Create the logger instance
    private static final Logger logger = LoggerFactory.getLogger(BiasDetectionService.class);

    public BiasResultDTO analyzeFairness(List<Map<String, String>> parsedData, String targetColumn, String groupA,
            String groupB) {

        // Log the start of the analysis
        logger.info("Starting bias analysis for column: {} comparing {} vs {}", targetColumn, groupA, groupB);

        double groupATotal = 0;
        double groupAApproved = 0;
        double groupBTotal = 0;
        double groupBApproved = 0;

        for (Map<String, String> row : parsedData) {
            String groupValue = row.getOrDefault(targetColumn, "").trim();
            String status = row.getOrDefault("selected / rejected", "").trim().toLowerCase();

            if (groupValue.equalsIgnoreCase(groupA)) {
                groupATotal++;
                if (status.equals("selected")) {
                    groupAApproved++;
                }
            } else if (groupValue.equalsIgnoreCase(groupB)) {
                groupBTotal++;
                if (status.equals("selected")) {
                    groupBApproved++;
                }
            }
        }

        if (groupATotal == 0 || groupBTotal == 0) {
            logger.error("Analysis failed: Insufficient data for groups {} or {}", groupA, groupB);
            throw new IllegalArgumentException("Not enough data to compare " + groupA + " and " + groupB);
        }

        double rateA = groupAApproved / groupATotal;
        double rateB = groupBApproved / groupBTotal;

        double disparityRatio;
        if (rateA == 0 && rateB == 0) {
            disparityRatio = 1.0;
        } else if (rateA < rateB) {
            disparityRatio = rateA / rateB;
        } else {
            disparityRatio = rateB / rateA;
        }

        // Log the final results of the calculation
        logger.info("Analysis results - Group A Rate: {}, Group B Rate: {}, Final Disparity Ratio: {}",
                rateA, rateB, disparityRatio);

        // Warning log if the disparity is high (standard threshold is usually < 0.8)
        if (disparityRatio < 0.8) {
            logger.warn("POTENTIAL BIAS DETECTED: Disparity ratio {} is below the 0.8 fairness threshold.",
                    disparityRatio);
        }

        return new BiasResultDTO(targetColumn, rateA, rateB, disparityRatio, null);
    }
}