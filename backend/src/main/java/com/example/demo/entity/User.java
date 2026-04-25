// package com.example.demo.entity; // Note: adjust 'com.example.demo' if your folder path is different

// import jakarta.persistence.*;
// import java.time.LocalDateTime;

// @Entity
// @Table(name = "users") // This tells PostgreSQL to create a table named "users"
// public class User {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     // This links to the Firebase Authentication system
//     @Column(nullable = false, unique = true)
//     private String firebaseUid;

//     @Column(nullable = false)
//     private String email;

//     private String name;

//     private String role; // Example: "ADMIN" or "STANDARD_USER"

//     private LocalDateTime createdAt;

//     // Default constructor required by JPA
//     public User() {
//         this.createdAt = LocalDateTime.now();
//     }

//     // Constructor for creating new users
//     public User(String firebaseUid, String email, String name, String role) {
//         this.firebaseUid = firebaseUid;
//         this.email = email;
//         this.name = name;
//         this.role = role;
//         this.createdAt = LocalDateTime.now();
//     }

//     // Getters and Setters so the rest of the application can access this data
//     public Long getId() {
//         return id;
//     }

//     public String getFirebaseUid() {
//         return firebaseUid;
//     }

//     public void setFirebaseUid(String firebaseUid) {
//         this.firebaseUid = firebaseUid;
//     }

//     public String getEmail() {
//         return email;
//     }

//     public void setEmail(String email) {
//         this.email = email;
//     }

//     public String getName() {
//         return name;
//     }

//     public void setName(String name) {
//         this.name = name;
//     }

//     public String getRole() {
//         return role;
//     }

//     public void setRole(String role) {
//         this.role = role;
//     }
// }   


package com.example.demo.entity; // Note: adjust 'com.example.demo' if your folder path is different

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users") // This tells PostgreSQL to create a table named "users"
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // This links to the Firebase Authentication system
    @Column(nullable = false, unique = true)
    private String firebaseUid;

    @Column(nullable = false)
    private String email;

    private String name;

    private String role; // Example: "ADMIN" or "STANDARD_USER"

    private String organizationName; // NEW: Helpful since FairLens is for companies

    private LocalDateTime createdAt;

    // Default constructor required by JPA
    public User() {
        this.createdAt = LocalDateTime.now();
    }

    // Constructor for creating new users
    public User(String firebaseUid, String email, String name, String role, String organizationName) {
        this.firebaseUid = firebaseUid;
        this.email = email;
        this.name = name;
        this.role = role;
        this.organizationName = organizationName;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters so the rest of the application can access this data
    public Long getId() {
        return id;
    }

    public String getFirebaseUid() {
        return firebaseUid;
    }

    public void setFirebaseUid(String firebaseUid) {
        this.firebaseUid = firebaseUid;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}