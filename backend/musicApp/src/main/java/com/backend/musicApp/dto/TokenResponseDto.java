package com.backend.musicApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TokenResponseDto {
    private String token;
    private Instant expiresIn;
    private Long userId;
}
