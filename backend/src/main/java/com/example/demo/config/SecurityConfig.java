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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Disable CSRF (Standard practice for REST APIs)
                .csrf(csrf -> csrf.disable())

                // 2. Enable CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 3. Make the API stateless
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 4. Set up Authorization Rules
                .authorizeHttpRequests(auth -> auth
                        // Public routes (if any)
                        .requestMatchers("/api/health", "/api/public/**").permitAll()
                        
                        // All other API routes MUST be authenticated via Firebase
                        .anyRequest().authenticated())

                // 5. Add Firebase Filter before the standard UsernamePasswordAuthenticationFilter
                .addFilterBefore(new FirebaseFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow the React dev server origin
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
