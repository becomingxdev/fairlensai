// package com.example.demo.service;

// public class CsvParserService {
    
// }



// package com.example.demo.service;

// import org.springframework.stereotype.Service;
// import org.springframework.web.multipart.MultipartFile;
// import java.io.BufferedReader;
// import java.io.InputStreamReader;
// import java.util.*;

// @Service
// public class CsvParserService {

//     public List<Map<String, String>> parseCsv(MultipartFile file) throws Exception {
//         List<Map<String, String>> records = new ArrayList<>();

//         // Open the file stream
//         try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
//             String headerLine = br.readLine();
//             if (headerLine == null) {
//                 throw new Exception("CSV file is empty");
//             }

//             // Extract column headers (e.g., gender, age, region)
//             String[] headers = headerLine.split(",");

//             String line;
//             while ((line = br.readLine()) != null) {
//                 String[] values = line.split(",");
//                 Map<String, String> record = new HashMap<>();

//                 // Map each value to its corresponding header column
//                 for (int i = 0; i < headers.length; i++) {
//                     String value = (i < values.length) ? values[i].trim() : "";
//                     record.put(headers[i].trim(), value);
//                 }
//                 records.add(record);
//             }
//         }
//         return records;
//     }
// }

package com.example.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.*;

@Service
public class CsvParserService {

    // Create the logger instance
    private static final Logger logger = LoggerFactory.getLogger(CsvParserService.class);

    public List<Map<String, String>> parseCsv(MultipartFile file) throws Exception {
        // Log the start of the parsing process
        logger.info("Received request to parse file: {} (Size: {} bytes)",
                file.getOriginalFilename(), file.getSize());

        List<Map<String, String>> records = new ArrayList<>();

        // Open the file stream
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String headerLine = br.readLine();
            if (headerLine == null) {
                logger.error("Failed to parse file: {} - The file is empty.", file.getOriginalFilename());
                throw new Exception("CSV file is empty");
            }

            // Extract column headers (e.g., gender, age, region)
            String[] headers = headerLine.split(",");
            logger.info("Headers detected: {}", Arrays.toString(headers));

            String line;
            int rowCount = 0;
            while ((line = br.readLine()) != null) {
                String[] values = line.split(",");
                Map<String, String> record = new HashMap<>();

                // Map each value to its corresponding header column
                for (int i = 0; i < headers.length; i++) {
                    String value = (i < values.length) ? values[i].trim() : "";
                    record.put(headers[i].trim(), value);
                }
                records.add(record);
                rowCount++;
            }

            // Log the final count of records processed
            logger.info("Successfully parsed {} records from {}", rowCount, file.getOriginalFilename());

        } catch (Exception e) {
            logger.error("Error occurred while parsing CSV file {}: {}",
                    file.getOriginalFilename(), e.getMessage());
            throw e;
        }

        return records;
    }
}