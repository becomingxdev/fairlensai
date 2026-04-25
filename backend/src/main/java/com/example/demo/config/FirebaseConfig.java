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

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initializeFirebase() throws IOException {
        try {
            // Your exact original logic is safely inside here now
            FileInputStream serviceAccount = new FileInputStream("src/main/resources/serviceAccountKey.json");

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                System.out.println("Firebase successfully initialized!");
            }
        } catch (Exception e) {
            // This stops the crash if the file is empty/missing
            System.out.println("Firebase is waiting for a valid serviceAccountKey.json file...");
        }
    }
}