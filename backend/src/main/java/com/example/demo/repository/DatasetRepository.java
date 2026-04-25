// package com.example.demo.repository;

// import com.example.demo.entity.Dataset;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;

// import java.util.List;

// @Repository
// public interface DatasetRepository extends JpaRepository<Dataset, Long> {

//     // This allows us to fetch all datasets uploaded by a specific user for their
//     // dashboard
//     List<Dataset> findByUploadedById(Long userId);
// }



package com.example.demo.repository;

import com.example.demo.entity.Dataset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DatasetRepository extends JpaRepository<Dataset, Long> {

    // This allows us to fetch all datasets uploaded by a specific user for their
    // dashboard
    List<Dataset> findByUploadedById(Long userId);

    // NEW: Since Firebase gives us a String UID, this method lets you find datasets
    // directly using that Firebase UID without needing to look up the Long ID
    // first!
    List<Dataset> findByUploadedByFirebaseUid(String firebaseUid);
}