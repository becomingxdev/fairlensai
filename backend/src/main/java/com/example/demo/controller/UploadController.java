// package com.example.demo.controller;

// public class UploadController {
    
// }


package com.example.demo.controller;

import com.example.demo.service.CsvParserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*") // Allows your React frontend to talk to this API
public class UploadController {

    private final CsvParserService csvParserService;

    // Spring Boot automatically injects the service here
    public UploadController(CsvParserService csvParserService) {
        this.csvParserService = csvParserService;
    }

    @PostMapping
    public ResponseEntity<?> uploadDataset(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please upload a valid CSV file.");
        }

        try {
            // Pass the uploaded file to our service to parse it
            List<Map<String, String>> parsedData = csvParserService.parseCsv(file);

            // Return a success response to the frontend
            return ResponseEntity.ok()
                    .body("Successfully parsed " + parsedData.size() + " records from " + file.getOriginalFilename());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing file: " + e.getMessage());
        }
    }
}