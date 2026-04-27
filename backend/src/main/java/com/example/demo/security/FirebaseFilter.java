package com.example.demo.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

public class FirebaseFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String idToken = header.replace("Bearer ", "");
            try {
                // Verify the token with Firebase
                FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);

                // Set the authentication in the context
                // We use UID as the principal. We could also pass the whole decodedToken if
                // needed.
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        decodedToken.getUid(), null, new ArrayList<>());

                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (Exception e) {
                // If token is present but invalid, return 401
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write(
                        "{\"error\": \"Invalid or expired Firebase token\", \"message\": \"" + e.getMessage() + "\"}");
                return;
            }
        }

        // Continue the filter chain.
        // If no token was provided, SecurityContext remains empty,
        // and Spring Security will block access if the route is protected.
        filterChain.doFilter(request, response);
    }
}
