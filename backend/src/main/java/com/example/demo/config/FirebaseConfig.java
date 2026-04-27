// package com.example.demo.config;

// import com.google.auth.oauth2.GoogleCredentials;
// import com.google.firebase.FirebaseApp;
// import com.google.firebase.FirebaseOptions;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;

// import java.io.FileInputStream;
// import java.io.IOException;

// @Configuration
// public class FirebaseConfig {

//     @Bean
//     public void initializeFirebase() throws IOException {
//         FileInputStream serviceAccount = new FileInputStream("src/main/resources/serviceAccountKey.json");

//         FirebaseOptions options = FirebaseOptions.builder()
//                 .setCredentials(GoogleCredentials.fromStream(serviceAccount))
//                 .build();

//         if (FirebaseApp.getApps().isEmpty()) {
//             FirebaseApp.initializeApp(options);
//         }
//     }
// }


package com.example.demo.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import java.io.InputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.config.path}")
    private String configPath;

    @Value("${firebase.credentials:}")
    private String credentialsJson;

    @PostConstruct
    public void initializeFirebase() throws IOException {
        try {
            InputStream serviceAccount;

            if (credentialsJson != null && !credentialsJson.isEmpty()) {
                // Load from direct JSON string (useful for Cloud Run env vars)
                serviceAccount = new java.io.ByteArrayInputStream(credentialsJson.getBytes());
                System.out.println("Firebase successfully initialized from environment variable.");
            } else if (configPath.startsWith("classpath:")) {
                serviceAccount = new ClassPathResource(configPath.replace("classpath:", "")).getInputStream();
                System.out.println("Firebase successfully initialized from classpath: " + configPath);
            } else {
                serviceAccount = new java.io.FileInputStream(configPath);
                System.out.println("Firebase successfully initialized from file: " + configPath);
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }
        } catch (Exception e) {
            System.err.println("Firebase initialization failed: " + e.getMessage());
        }
    }
}