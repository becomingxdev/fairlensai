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

    private static final Logger logger = LoggerFactory.getLogger(CsvParserService.class);

    public List<String> getHeaders(MultipartFile file) throws Exception {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String headerLine = br.readLine();
            if (headerLine == null) {
                throw new Exception("CSV file is empty");
            }
            return parseLine(headerLine);
        }
    }

    public List<Map<String, String>> parseCsv(MultipartFile file) throws Exception {
        logger.info("Parsing file: {}", file.getOriginalFilename());
        List<Map<String, String>> records = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String headerLine = br.readLine();
            if (headerLine == null) {
                throw new Exception("CSV file is empty");
            }

            List<String> headers = parseLine(headerLine);
            String line;
            while ((line = br.readLine()) != null) {
                if (line.trim().isEmpty()) continue;
                List<String> values = parseLine(line);
                Map<String, String> record = new HashMap<>();

                for (int i = 0; i < headers.size(); i++) {
                    String value = (i < values.size()) ? values.get(i) : "";
                    record.put(headers.get(i), value);
                }
                records.add(record);
            }
        }
        return records;
    }

    /**
     * Robust CSV line parser that handles quoted values with commas
     */
    private List<String> parseLine(String line) {
        List<String> result = new ArrayList<>();
        StringBuilder curVal = new StringBuilder();
        boolean inQuotes = false;
        char[] chars = line.toCharArray();

        for (int i = 0; i < chars.length; i++) {
            char ch = chars[i];
            if (inQuotes) {
                if (ch == '\"') {
                    if (i + 1 < chars.length && chars[i + 1] == '\"') {
                        curVal.append('\"'); // escaped quote
                        i++;
                    } else {
                        inQuotes = false;
                    }
                } else {
                    curVal.append(ch);
                }
            } else {
                if (ch == '\"') {
                    inQuotes = true;
                } else if (ch == ',') {
                    result.add(curVal.toString().trim());
                    curVal = new StringBuilder();
                } else {
                    curVal.append(ch);
                }
            }
        }
        result.add(curVal.toString().trim());
        return result;
    }
}