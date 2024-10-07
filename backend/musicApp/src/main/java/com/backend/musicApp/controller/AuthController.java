package com.backend.musicApp.controller;

import com.backend.musicApp.dto.*;
import com.backend.musicApp.entity.User;
import com.backend.musicApp.infra.Security.JwtTokenProvider;
import com.backend.musicApp.infra.Security.TokenService;
import com.backend.musicApp.infra.Security.VerifyJwtCookieToken;
import com.backend.musicApp.mapper.UserInfoMapper;
import com.backend.musicApp.mapper.UserMapper;
import com.backend.musicApp.service.iUserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


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
    public ResponseEntity<Map<String, Object>> refreshToken(HttpServletRequest request, HttpServletResponse response) {

        Cookie[] cookies = request.getCookies();
        Cookie jwtCookie = null;
        TokenResponseDto shortDurationToken  = null;

        if(cookies != null) {
            for (Cookie cookie : cookies) {
                if ("JWT_REFRESH_TOKEN".equals(cookie.getName())) {
                    jwtCookie = cookie;
                    Optional<User> user = verifyJwtCookieToken.verifyJwtToken(jwtCookie.getValue());
                    if(user.isPresent()) {
                        shortDurationToken = tokenService.generateToken(user.get());
                    }

                    break;
                }
            }
        }

        if (shortDurationToken != null) {
            Cookie cookieCurtaDuracao = new Cookie("JWT_TOKEN", shortDurationToken.getToken());
            cookieCurtaDuracao.setHttpOnly(true);
            cookieCurtaDuracao.setSecure(true);
            cookieCurtaDuracao.setPath("/");
            cookieCurtaDuracao.setMaxAge(3600);
            response.addCookie(cookieCurtaDuracao);

            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("expiresIn", shortDurationToken.getExpiresIn());
            responseMap.put("userId", shortDurationToken.getUserId());

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(responseMap);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/login")
    public  ResponseEntity<UserInfoDto> login(@RequestBody @Valid AuthDto data, HttpServletResponse response){
        UsernamePasswordAuthenticationToken userNamePassword = new UsernamePasswordAuthenticationToken(
                data.getEmail(),
                data.getPassword()
        );
        Authentication auth = this.authenticationManager.authenticate(userNamePassword);

        TokenResponseDto tokenCurtaDuracao = tokenService.generateToken((User) auth.getPrincipal());

        String tokenLongaDuracao = jwtTokenProvider.generateToken((User) auth.getPrincipal());

        Cookie cookieLongaDuracao = new Cookie("JWT_TOKEN", tokenLongaDuracao);
        cookieLongaDuracao.setHttpOnly(true);
        cookieLongaDuracao.setSecure(true);
        cookieLongaDuracao.setPath("/");
        cookieLongaDuracao.setMaxAge(3600);

        response.addCookie(cookieLongaDuracao);

        Cookie cookieCurtaDuracao = new Cookie("JWT_REFRESH_TOKEN", tokenCurtaDuracao.getToken());
        cookieCurtaDuracao.setHttpOnly(true);
        cookieCurtaDuracao.setSecure(true);
        cookieCurtaDuracao.setPath("/");
        cookieCurtaDuracao.setMaxAge(3600);
        response.addCookie(cookieCurtaDuracao);

        User user = (User) auth.getPrincipal();
        UserInfoDto userInfoDto = UserInfoMapper.toDto(user);


        return ResponseEntity
                .status(HttpStatus.OK)
                .body(userInfoDto);
    }

    @PostMapping("/admin-login")
    public ResponseEntity<UserInfoDto> adminLogin(@RequestBody @Valid AuthDto data, HttpServletResponse response) {
        UsernamePasswordAuthenticationToken userNamePassword = new UsernamePasswordAuthenticationToken(
                data.getEmail(),
                data.getPassword()
        );

        Authentication auth = this.authenticationManager.authenticate(userNamePassword);

        User user = (User) auth.getPrincipal();

        List<String> authorities = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        if (!authorities.contains("ROLE_ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(null);
        }

        TokenResponseDto tokenCurtaDuracao = tokenService.generateToken(user);
        String tokenLongaDuracao = jwtTokenProvider.generateToken(user);

        Cookie cookieLongaDuracao = new Cookie("JWT_TOKEN", tokenLongaDuracao);
        cookieLongaDuracao.setHttpOnly(true);
        cookieLongaDuracao.setSecure(true);
        cookieLongaDuracao.setPath("/");
        cookieLongaDuracao.setMaxAge(3600);
        response.addCookie(cookieLongaDuracao);

        Cookie cookieCurtaDuracao = new Cookie("JWT_REFRESH_TOKEN", tokenCurtaDuracao.getToken());
        cookieCurtaDuracao.setHttpOnly(true);
        cookieCurtaDuracao.setSecure(true);
        cookieCurtaDuracao.setPath("/");
        cookieCurtaDuracao.setMaxAge(3600);
        response.addCookie(cookieCurtaDuracao);

        UserInfoDto userInfoDto = UserInfoMapper.toDto(user);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(userInfoDto);
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

    @GetMapping("/user-info")
    public ResponseEntity<UserInfoDto> userInfo(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("JWT_TOKEN".equals(cookie.getName())) {
                    Optional<User> user = verifyJwtCookieToken.verifyJwtToken(cookie.getValue());
                    if (user.isPresent()) {
                        UserInfoDto userInfoDto = UserInfoMapper.toDto(user.get());
                        return ResponseEntity.ok(userInfoDto);
                    }
                    break;
                }
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }
}
