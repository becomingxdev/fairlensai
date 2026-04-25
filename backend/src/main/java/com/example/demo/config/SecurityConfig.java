// package com.example.demo.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
// import org.springframework.security.web.SecurityFilterChain;

// @Configuration
// @EnableWebSecurity
// public class SecurityConfig {
//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//         http
//                 // We disable CSRF protection temporarily so we can test POST requests like file
//                 // uploads
//                 .csrf(AbstractHttpConfigurer::disable)

//                 // This configures which endpoints are locked and which are open
//                 .authorizeHttpRequests(auth -> auth
//                         // Allow anyone to access the upload endpoint for testing right now
//                         .requestMatchers("/api/upload",
//                                 "/api/analyze").permitAll()

//                         // Keep everything else locked down
//                         .anyRequest().authenticated());

//         return http.build();
//     }
// }

package com.example.demo.config;

import com.example.demo.security.FirebaseFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Disable CSRF (Standard practice for REST APIs)
                .csrf(csrf -> csrf.disable())

                // 2. Enable CORS so your React frontend can talk to this backend without
                // getting blocked
                .cors(cors -> cors.configure(http))

                // 3. Make the API stateless (We rely on Firebase tokens, not server sessions)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 4. Lock the doors: EVERY request must be authenticated
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().authenticated())

                // 5. Put our Firebase "Bouncer" at the front door before anything else
                .addFilterBefore(new FirebaseFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}