    
// package com.example.demo.entity; // Note: adjust 'com.example.demo' to match your folders

// import jakarta.persistence.*;
// import java.time.LocalDateTime;

// @Entity
// @Table(name = "datasets")
// public class Dataset {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @Column(nullable = false)
//     private String filename;

//     private String status; // To track if it is "UPLOADED", "PROCESSING", or "ANALYZED"

//     @Column(name = "uploaded_at")
//     private LocalDateTime uploadedAt;

//     // This creates a Foreign Key connecting the dataset to the user who uploaded it
//     @ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "user_id", nullable = false)
//     private User uploadedBy;

//     // Default constructor
//     public Dataset() {
//         this.uploadedAt = LocalDateTime.now();
//     }

//     // Constructor for when a user uploads a new file
//     public Dataset(String filename, User uploadedBy) {
//         this.filename = filename;
//         this.status = "UPLOADED";
//         this.uploadedBy = uploadedBy;
//         this.uploadedAt = LocalDateTime.now();
//     }

//     // Getters and Setters
//     public Long getId() {
//         return id;
//     }

//     public String getFilename() {
//         return filename;
//     }

//     public void setFilename(String filename) {
//         this.filename = filename;
//     }

//     public String getStatus() {
//         return status;
//     }

//     public void setStatus(String status) {
//         this.status = status;
//     }

//     public User getUploadedBy() {
//         return uploadedBy;
//     }

//     public void setUploadedBy(User uploadedBy) {
//         this.uploadedBy = uploadedBy;
//     }

//     public LocalDateTime getUploadedAt() {
//         return uploadedAt;
//     }
// }



package com.example.demo.entity; // Note: adjust 'com.example.demo' to match your folders

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "datasets")
public class Dataset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String filename;

    private String status; // To track if it is "UPLOADED", "PROCESSING", or "ANALYZED"

    // PRD Requirement: Save Dataset Metadata
    private long fileSize; // Size in bytes
    private int rowCount; // How many records were in the CSV

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    // This creates a Foreign Key connecting the dataset to the user who uploaded it
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User uploadedBy;

    // Default constructor
    public Dataset() {
        this.uploadedAt = LocalDateTime.now();
    }

    // Constructor for when a user uploads a new file (Updated with metadata)
    public Dataset(String filename, User uploadedBy, long fileSize, int rowCount) {
        this.filename = filename;
        this.status = "UPLOADED";
        this.uploadedBy = uploadedBy;
        this.fileSize = fileSize;
        this.rowCount = rowCount;
        this.uploadedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public long getFileSize() {
        return fileSize;
    }

    public void setFileSize(long fileSize) {
        this.fileSize = fileSize;
    }

    public int getRowCount() {
        return rowCount;
    }

    public void setRowCount(int rowCount) {
        this.rowCount = rowCount;
    }

    public User getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(User uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }
}