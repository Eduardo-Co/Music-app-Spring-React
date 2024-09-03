package com.backend.musicApp.controller;

import com.backend.musicApp.dto.AuthDto;
import com.backend.musicApp.dto.ResponseDto;
import com.backend.musicApp.dto.TokenResponseDto;
import com.backend.musicApp.dto.UserDto;
import com.backend.musicApp.entity.User;
import com.backend.musicApp.infra.Security.JwtTokenProvider;
import com.backend.musicApp.infra.Security.TokenService;
import com.backend.musicApp.infra.Security.VerifyJwtCookieToken;
import com.backend.musicApp.service.iUserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("auth")
public class AuthController {

    private final iUserService userService;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final JwtTokenProvider jwtTokenProvider;
    private final VerifyJwtCookieToken verifyJwtCookieToken;

    @Autowired
    public AuthController(iUserService userService, AuthenticationManager authenticationManager, TokenService tokenService,
                          JwtTokenProvider jwtTokenProvider, VerifyJwtCookieToken verifyJwtCookieToken) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.verifyJwtCookieToken = verifyJwtCookieToken;
    }

    @GetMapping("/refresh-token")
    public ResponseEntity<TokenResponseDto> refreshToken(HttpServletRequest request) {

        Cookie[] cookies = request.getCookies();
        Cookie jwtCookie = null;
        String shortDurationToken  = null;

        if(cookies != null) {
            for (Cookie cookie : cookies) {
                if ("JWT_TOKEN".equals(cookie.getName())) {
                    jwtCookie = cookie;
                    shortDurationToken = verifyJwtCookieToken.verifyJwtToken(jwtCookie.getValue());
                    break;
                }
            }
        }

        if (shortDurationToken != null) {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new TokenResponseDto(
                            shortDurationToken
                    ));

        }


        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/login")
        public ResponseEntity<TokenResponseDto> login(@RequestBody @Valid AuthDto data, HttpServletResponse response){
        UsernamePasswordAuthenticationToken userNamePassword = new UsernamePasswordAuthenticationToken(
                data.getEmail(),
                data.getPassword()
        );
        Authentication auth = this.authenticationManager.authenticate(userNamePassword);

        var token = tokenService.generateToken((User) auth.getPrincipal());

        String tokenCookie = jwtTokenProvider.generateToken((User) auth.getPrincipal());

        Cookie cookie = new Cookie("JWT_TOKEN", tokenCookie);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(3600);

        response.addCookie(cookie);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new TokenResponseDto(
                        token
                ));
    }

    @PostMapping("/register")
    public ResponseEntity<ResponseDto> register(@RequestBody @Valid UserDto data){

        userService.createUser(data);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ResponseDto(
                        "200",
                        LocalDateTime.now().toString(),
                        "User created Successfully"
                ));
    }
}
