package com.example.demo.dto;

import java.util.List;

public class UploadResponseDTO {
    private Long id;
    private String filename;
    private List<String> headers;
    private int rowCount;

    public UploadResponseDTO(Long id, String filename, List<String> headers, int rowCount) {
        this.id = id;
        this.filename = filename;
        this.headers = headers;
        this.rowCount = rowCount;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public List<String> getHeaders() {
        return headers;
    }

    public void setHeaders(List<String> headers) {
        this.headers = headers;
    }

    public int getRowCount() {
        return rowCount;
    }

    public void setRowCount(int rowCount) {
        this.rowCount = rowCount;
    }
}
