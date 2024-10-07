package com.backend.musicApp.infra.Security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.backend.musicApp.dto.TokenResponseDto;
import com.backend.musicApp.entity.User;
import com.backend.musicApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Optional;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    @Value("${api.security.tokenShortDuration.expiration}")
    private long expirationSeconds;

    public TokenResponseDto generateToken(User user) {
        try{
            Algorithm algorithm = Algorithm.HMAC256(secret);
            Instant expirationDate = genExpirationDate();
            String token = JWT.create()
                    .withIssuer("auth-api")
                    .withSubject(user.getEmail())
                    .withExpiresAt(genExpirationDate())
                    .sign(algorithm);

            TokenResponseDto tokenResponseDto = new TokenResponseDto();
            tokenResponseDto.setToken(token);
            tokenResponseDto.setExpiresIn(expirationDate);
            tokenResponseDto.setUserId(user.getUserId());

            return tokenResponseDto;

        }catch (JWTCreationException e){
            throw new RuntimeException("Error while generating token", e);
        }
    }

    private Instant genExpirationDate(){
        return LocalDateTime.now().plusSeconds(expirationSeconds).toInstant(ZoneOffset.of("-03:00"));
    }

    public String verifyToken(String token) {
        try{
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("auth-api")
                    .build()
                    .verify(token)
                    .getSubject();

        }catch (JWTVerificationException e){
            System.out.println(e.getMessage());
            return "";
        }
    }
}
