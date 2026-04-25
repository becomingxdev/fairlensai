// package com.example.demo.controller;

// public class AuthController {
    
// }



package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // The frontend will call this immediately after a user logs in with Firebase
    @PostMapping("/sync")
    public ResponseEntity<?> syncUser(@RequestBody Map<String, String> payload) {

        // 1. Get the verified Firebase UID from our Security Bouncer
        String uid = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 2. Check if this user already exists in our PostgreSQL database
        Optional<User> existingUser = userRepository.findByFirebaseUid(uid);

        if (existingUser.isPresent()) {
            // User already exists, just return their profile
            return ResponseEntity.ok(existingUser.get());
        }

        // 3. If they are a brand new user, create their profile using the data from the
        // frontend
        String email = payload.get("email");
        String name = payload.get("name");
        String organizationName = payload.get("organizationName"); // Optional

        // Default role for a new signup
        String role = "STANDARD_USER";

        User newUser = new User(uid, email, name, role, organizationName);
        userRepository.save(newUser);

        return ResponseEntity.ok(newUser);
    }
}