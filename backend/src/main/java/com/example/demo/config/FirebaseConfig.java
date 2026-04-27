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

    @PostConstruct
    public void initializeFirebase() throws IOException {
        try {
            InputStream serviceAccount;
            if (configPath.startsWith("classpath:")) {
                serviceAccount = new ClassPathResource(configPath.replace("classpath:", "")).getInputStream();
            } else {
                serviceAccount = new java.io.FileInputStream(configPath);
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                System.out.println("Firebase successfully initialized from: " + configPath);
            }
        } catch (Exception e) {
            System.err.println("Firebase initialization failed: " + e.getMessage());
            System.out.println("Ensure " + configPath + " exists and is a valid Firebase service account file.");
        }
    }
}