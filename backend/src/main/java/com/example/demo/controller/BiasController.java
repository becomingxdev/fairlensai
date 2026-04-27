// package com.example.demo.controller;

// import com.example.demo.dto.BiasResultDTO;
// import com.example.demo.entity.AuditReport; // Added for Phase 2
// import com.example.demo.repository.AuditReportRepository; // Added for Phase 2
// import com.example.demo.service.BiasDetectionService;
// import com.example.demo.service.CsvParserService;
// import com.example.demo.service.RecommendationService; // Added for Phase 1
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.context.SecurityContextHolder; // NEW: For UID extraction
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.multipart.MultipartFile;

// import java.util.List;
// import java.util.Map;

// @RestController
// @RequestMapping("/api/analyze")
// @CrossOrigin(origins = "*")
// public class BiasController {

//     private final CsvParserService csvParserService;
//     private final BiasDetectionService biasDetectionService;
//     private final RecommendationService recommendationService; // Added
//     private final AuditReportRepository auditReportRepository; // Added

//     // Spring Boot automatically injects all four dependencies here
//     public BiasController(CsvParserService csvParserService,
//             BiasDetectionService biasDetectionService,
//             RecommendationService recommendationService,
//             AuditReportRepository auditReportRepository) {
//         this.csvParserService = csvParserService;
//         this.biasDetectionService = biasDetectionService;
//         this.recommendationService = recommendationService;
//         this.auditReportRepository = auditReportRepository;
//     }

//     @PostMapping
//     public ResponseEntity<?> analyzeDataset(@RequestParam("file") MultipartFile file) {
//         if (file.isEmpty()) {
//             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please upload a valid CSV file.");
//         }

//         try {
//             // NEW: Extract the Firebase UID from the security context
//             // Once the key is added, this will tell us exactly which teammate uploaded the
//             // file
//             String uid = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

//             // 1. Parse the incoming CSV file
//             List<Map<String, String>> parsedData = csvParserService.parseCsv(file);

//             // 2. Run the Bias Detection Engine
//             String targetColumn = "gender";
//             String groupA = "Male";
//             String groupB = "Female";

//             // Get initial math result
//             BiasResultDTO tempResult = biasDetectionService.analyzeFairness(parsedData, targetColumn, groupA, groupB);

//             // 3. Generate Recommendations (Phase 1 Logic)
//             String disadvantagedGroup = tempResult.getGroupAApprovalRate() < tempResult.getGroupBApprovalRate() ? groupA
//                     : groupB;
//             List<String> insights = recommendationService.generateRecommendations(tempResult.getDisparityRatio(),
//                     disadvantagedGroup);

//             // 4. Save to Database (Phase 2 Logic)
//             AuditReport report = new AuditReport();
//             report.setFileName(file.getOriginalFilename());
//             report.setUserId(uid); // NEW: Save the UID with the report
//             report.setTargetColumn(targetColumn);
//             report.setDisparityRatio(tempResult.getDisparityRatio());
//             report.setBiased(tempResult.isBiased());
//             report.setSuggestions(String.join("; ", insights));
//             auditReportRepository.save(report);

//             // 5. Package final result with recommendations
//             BiasResultDTO finalResult = new BiasResultDTO(
//                     tempResult.getGroupName(),
//                     tempResult.getGroupAApprovalRate(),
//                     tempResult.getGroupBApprovalRate(),
//                     tempResult.getDisparityRatio(),
//                     insights);

//             // Return the calculated result including recommendations
//             return ResponseEntity.ok(finalResult);

//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body("Error analyzing data: " + e.getMessage());
//         }
//     }

//     // NEW: API for your teammate to fetch the history on the frontend dashboard
//     @GetMapping("/history")
//     public ResponseEntity<List<AuditReport>> getMyHistory() {
//         try {
//             String uid = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//             // This will return all reports currently; we can filter by UID in the next step
//             return ResponseEntity.ok(auditReportRepository.findAll());
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//         }
//     }
// }



package com.example.demo.controller;

import com.example.demo.dto.BiasResultDTO;
import com.example.demo.entity.AuditReport;
import com.example.demo.entity.Dataset; // NEW: For Phase 2
import com.example.demo.entity.User;    // NEW: For Phase 2
import com.example.demo.repository.AuditReportRepository;
import com.example.demo.repository.DatasetRepository; // NEW: For Phase 2
import com.example.demo.repository.UserRepository;    // NEW: For Phase 2
import com.example.demo.service.BiasDetectionService;
import com.example.demo.service.CsvParserService;
import com.example.demo.service.RecommendationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/analyze")
public class BiasController {

    private final CsvParserService csvParserService;
    private final BiasDetectionService biasDetectionService;
    private final RecommendationService recommendationService;
    private final AuditReportRepository auditReportRepository;
    
    // NEW: Injecting the new repositories so we can talk to the User and Dataset tables
    private final UserRepository userRepository;
    private final DatasetRepository datasetRepository;

    // Spring Boot automatically injects all dependencies here
    public BiasController(CsvParserService csvParserService,
            BiasDetectionService biasDetectionService,
            RecommendationService recommendationService,
            AuditReportRepository auditReportRepository,
            UserRepository userRepository,
            DatasetRepository datasetRepository) {
        this.csvParserService = csvParserService;
        this.biasDetectionService = biasDetectionService;
        this.recommendationService = recommendationService;
        this.auditReportRepository = auditReportRepository;
        this.userRepository = userRepository;
        this.datasetRepository = datasetRepository;
    }

    @PostMapping
    public ResponseEntity<?> analyzeDataset(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please upload a valid CSV file.");
        }

        try {
            // 1. Extract the Firebase UID from the security context
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (!(principal instanceof String)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated.");
            }
            String uid = (String) principal;


            // 2. Look up the actual User profile in the database
            Optional<User> optionalUser = userRepository.findByFirebaseUid(uid);
            User loggedInUser;
            
            if (optionalUser.isEmpty()) {
                // If the mock user doesn't exist, create it on the fly for testing
                loggedInUser = new User(uid, "tester@example.com", "Test User", "STANDARD_USER", "Mock Org");
                userRepository.save(loggedInUser);
            } else {
                loggedInUser = optionalUser.get();
            }


            // 3. Parse the incoming CSV file
            List<Map<String, String>> parsedData = csvParserService.parseCsv(file);

            // 4. NEW: Save Dataset Metadata (Satisfies the PRD Requirement)
            Dataset dataset = new Dataset(
                file.getOriginalFilename(),
                loggedInUser,
                file.getSize(),
                parsedData.size()
            );
            datasetRepository.save(dataset);

            // 5. Run the Bias Detection Engine
            String targetColumn = "gender";
            String groupA = "Male";
            String groupB = "Female";

            // Get initial math result
            BiasResultDTO tempResult = biasDetectionService.analyzeFairness(parsedData, targetColumn, groupA, groupB);

            // 6. Generate Recommendations
            String disadvantagedGroup = tempResult.getGroupAApprovalRate() < tempResult.getGroupBApprovalRate() ? groupA
                    : groupB;
            List<String> insights = recommendationService.generateRecommendations(tempResult.getDisparityRatio(),
                    disadvantagedGroup);

            // 7. Save to Database
            AuditReport report = new AuditReport();
            report.setFileName(file.getOriginalFilename());
            report.setUserId(uid); // Save the UID with the report
            report.setTargetColumn(targetColumn);
            report.setDisparityRatio(tempResult.getDisparityRatio());
            report.setBiased(tempResult.isBiased());
            report.setSuggestions(String.join("; ", insights));
            auditReportRepository.save(report);

            // 8. Package final result with recommendations
            BiasResultDTO finalResult = new BiasResultDTO(
                    tempResult.getGroupName(),
                    tempResult.getGroupAApprovalRate(),
                    tempResult.getGroupBApprovalRate(),
                    tempResult.getDisparityRatio(),
                    insights);

            // Return the calculated result including recommendations
            return ResponseEntity.ok(finalResult);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error analyzing data: " + e.getMessage());
        }
    }

    // API for the frontend dashboard to fetch history
    @GetMapping("/history")
    public ResponseEntity<List<AuditReport>> getMyHistory() {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (!(principal instanceof String)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            String uid = (String) principal;
            
            // UPDATED: Now filters the database so a user only sees their own reports
            return ResponseEntity.ok(auditReportRepository.findByUserId(uid));


        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}