package com.example.demo.controller;

import com.example.demo.dto.AnalysisResultDTO;
import com.example.demo.entity.AuditReport;
import com.example.demo.entity.Dataset;
import com.example.demo.entity.User;
import com.example.demo.repository.AuditReportRepository;
import com.example.demo.repository.DatasetRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.BiasDetectionService;
import com.example.demo.service.CsvParserService;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    private final AuditReportRepository auditReportRepository;
    private final UserRepository userRepository;
    private final DatasetRepository datasetRepository;
    private final ObjectMapper objectMapper;

    public BiasController(CsvParserService csvParserService,
            BiasDetectionService biasDetectionService,
            AuditReportRepository auditReportRepository,
            UserRepository userRepository,
            DatasetRepository datasetRepository,
            ObjectMapper objectMapper) {
        this.csvParserService = csvParserService;
        this.biasDetectionService = biasDetectionService;
        this.auditReportRepository = auditReportRepository;
        this.userRepository = userRepository;
        this.datasetRepository = datasetRepository;
        this.objectMapper = objectMapper;
    }

    @PostMapping
    public ResponseEntity<?> analyzeDataset(
            @RequestParam("file") MultipartFile file,
            @RequestParam("targetColumn") String targetColumn,
            @RequestParam("protectedColumn") String protectedColumn,
            @RequestParam("groupA") String groupA,
            @RequestParam("groupB") String groupB,
            @RequestParam("approvalValue") String approvalValue) {
            
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

            // 2. Look up the User profile in the database
            Optional<User> optionalUser = userRepository.findByFirebaseUid(uid);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User profile not found.");
            }
            User loggedInUser = optionalUser.get();

            // 3. Parse the incoming CSV file
            List<Map<String, String>> parsedData = csvParserService.parseCsv(file);

            // 4. Save Dataset Metadata
            Dataset dataset = new Dataset(
                file.getOriginalFilename(),
                loggedInUser,
                file.getSize(),
                parsedData.size()
            );
            datasetRepository.save(dataset);

            // 5. Run Advanced Bias Detection using dynamic mappings
            AnalysisResultDTO result = biasDetectionService.analyzeFairness(
                parsedData, 
                protectedColumn, 
                targetColumn, 
                groupA, 
                groupB, 
                approvalValue
            );

            // 6. Save Detailed Audit Report
            AuditReport report = new AuditReport();
            report.setFileName(file.getOriginalFilename());
            report.setUserId(uid);
            report.setTargetColumn(protectedColumn);
            // We use the first metric (Disparate Impact) for the primary ratio field
            report.setDisparityRatio(result.getMetrics().get(0).getValue());
            report.setBiased(!result.getMetrics().get(0).getStatus().equals("Pass"));
            report.setFairnessScore(result.getFairnessScore());
            report.setSeverity(result.getSeverity());
            report.setSuggestions(String.join("; ", result.getRecommendations()));
            
            // Serialize full result to JSON
            report.setDetailsJson(objectMapper.writeValueAsString(result));
            
            auditReportRepository.save(report);

            // 7. Return final result
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error during bias analysis: " + e.getMessage());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<AuditReport>> getMyHistory() {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (!(principal instanceof String)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            String uid = (String) principal;
            return ResponseEntity.ok(auditReportRepository.findByUserId(uid));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}