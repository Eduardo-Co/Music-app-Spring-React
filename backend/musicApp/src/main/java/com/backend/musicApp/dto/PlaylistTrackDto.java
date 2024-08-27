package com.backend.musicApp.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaylistTrackDto {
    private Long playlistTrackId;
    private Long playlistId;
    private String playlistTitle;
    private Long trackId;
    private String trackTitle;
}
