// package com.example.demo.repository;

// public class UserRepository {
    
// }

package com.example.demo.repository;

import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // The magic of Spring Boot: It automatically writes the SQL for these methods
    // based on their names!
    Optional<User> findByFirebaseUid(String firebaseUid);

    Optional<User> findByEmail(String email);
}