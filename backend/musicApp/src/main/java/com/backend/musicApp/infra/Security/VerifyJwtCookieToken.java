package com.backend.musicApp.infra.Security;

import com.backend.musicApp.entity.User;
import com.backend.musicApp.exception.UserNotAuthenticatedException;
import com.backend.musicApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class VerifyJwtCookieToken {

    private final TokenService tokenService;
    private final UserRepository userRepository;

    @Autowired
    public VerifyJwtCookieToken(TokenService tokenService, UserRepository userRepository) {
        this.tokenService = tokenService;
        this.userRepository = userRepository;
    }

    public String verifyJwtToken(String token) {
        if (token != null && !token.isEmpty()) {
            String email = tokenService.verifyToken(token);

            if(email == null || email.isEmpty()) {
                throw new UserNotAuthenticatedException();
            }

            User user = userRepository.findUserByEmail(email);

            if (user != null) {
                return tokenService.generateToken(user);
            }

        }

        return null;
    }
}
