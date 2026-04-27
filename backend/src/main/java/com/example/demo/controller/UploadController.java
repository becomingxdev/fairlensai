package com.example.demo.controller;

import com.example.demo.dto.UploadResponseDTO;
import com.example.demo.entity.Dataset;
import com.example.demo.entity.User;
import com.example.demo.repository.DatasetRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.CsvParserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    private final CsvParserService csvParserService;
    private final DatasetRepository datasetRepository;
    private final UserRepository userRepository;

    public UploadController(CsvParserService csvParserService, DatasetRepository datasetRepository, UserRepository userRepository) {
        this.csvParserService = csvParserService;
        this.datasetRepository = datasetRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> uploadDataset(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please upload a valid CSV file.");
        }

        try {
            // 1. Authentication Check
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (!(principal instanceof String)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated.");
            }
            String uid = (String) principal;

            Optional<User> optionalUser = userRepository.findByFirebaseUid(uid);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User profile not synced.");
            }
            User user = optionalUser.get();

            // 2. Parse Headers and Records
            List<String> headers = csvParserService.getHeaders(file);
            List<Map<String, String>> parsedData = csvParserService.parseCsv(file);

            // 3. Save Dataset Metadata
            Dataset dataset = new Dataset(
                file.getOriginalFilename(),
                user,
                file.getSize(),
                parsedData.size()
            );
            Dataset savedDataset = datasetRepository.save(dataset);

            // 4. Return Metadata and Headers for Mapping
            UploadResponseDTO response = new UploadResponseDTO(
                savedDataset.getId(),
                savedDataset.getFilename(),
                headers,
                savedDataset.getRowCount()
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing file: " + e.getMessage());
        }
    }
}