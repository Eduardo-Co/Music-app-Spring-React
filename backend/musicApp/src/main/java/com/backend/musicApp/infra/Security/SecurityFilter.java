package com.backend.musicApp.infra.Security;

import com.backend.musicApp.exception.UserNotAuthenticatedException;
import com.backend.musicApp.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final UserRepository userRepository;

    public SecurityFilter(UserRepository userRepository, TokenService tokenService) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
    }

//    private String recoveryToken(HttpServletRequest request) {
//
//        String authHeader = request.getHeader("Authorization");
//        if(authHeader == null) return null;
//        return authHeader.replace("Bearer ", "");
//    }

    private String getTokenFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("JWT_TOKEN".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = this.getTokenFromCookies(request);
        if(token != null) {

            String email = this.tokenService.verifyToken(token);

            if(email.isEmpty()) throw new UserNotAuthenticatedException();

            UserDetails userDetails = userRepository.findByEmail(email);

            if (userDetails != null) {
                var authentication = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                throw new UserNotAuthenticatedException("User Not Founded");
            }
        }
        filterChain.doFilter(request, response);
    }
}
