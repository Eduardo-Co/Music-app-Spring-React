package com.backend.musicApp.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LikeDto {
    private Long likeId;
    private Long userId;
    private String username; // Opcional
    private Long trackId;
    private String trackTitle; // Opcional
    private LocalDateTime createdAt;
}
