// // package com.example.demo.repository;

// // public class AuditReportRepository {
    
// // }


// package com.example.demo.repository;

// import com.example.demo.entity.AuditReport;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;

// @Repository
// public interface AuditReportRepository extends JpaRepository<AuditReport, Long> {
// }



package com.example.demo.repository;

import com.example.demo.entity.AuditReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List; // Added this import so Java knows what a List is

@Repository
public interface AuditReportRepository extends JpaRepository<AuditReport, Long> {

    // This custom method allows the backend to find reports belonging ONLY to the
    // logged-in teammate
    List<AuditReport> findByUserId(String userId);
}