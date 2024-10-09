package com.backend.musicApp.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LikeDto {

    @NotNull(message = "Like ID cannot be null")
    @Positive(message = "Like ID must be a positive number")
    private Long likeId;

    @NotNull(message = "User ID cannot be null")
    @Positive(message = "User ID must be a positive number")
    private Long userId;

    @Size(max = 50, message = "Username must be less than 50 characters")
    private String username; // Opcional

    @NotNull(message = "Track ID cannot be null")
    @Positive(message = "Track ID must be a positive number")
    private Long trackId;

    @Size(max = 100, message = "Track title must be less than 100 characters")
    private String trackTitle; // Opcional

    @NotNull(message = "Creation date cannot be null")
    private LocalDateTime createdAt;
}
