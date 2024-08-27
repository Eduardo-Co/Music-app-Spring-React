package com.backend.musicApp.dto;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaylistDto {
    private Long playlistId;
    private Long userId;
    private String title;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
