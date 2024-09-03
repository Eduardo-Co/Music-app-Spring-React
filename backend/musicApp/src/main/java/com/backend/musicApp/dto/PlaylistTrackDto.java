package com.backend.musicApp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaylistTrackDto {

    @NotNull(message = "Playlist Track ID cannot be null")
    @Positive(message = "Playlist Track ID must be a positive number")
    private Long playlistTrackId;

    @NotNull(message = "Playlist ID cannot be null")
    @Positive(message = "Playlist ID must be a positive number")
    private Long playlistId;

    @NotBlank(message = "Playlist title cannot be blank")
    @Size(max = 100, message = "Playlist title must be less than 100 characters")
    private String playlistTitle;

    @NotNull(message = "Track ID cannot be null")
    @Positive(message = "Track ID must be a positive number")
    private Long trackId;

    @NotBlank(message = "Track title cannot be blank")
    @Size(max = 100, message = "Track title must be less than 100 characters")
    private String trackTitle;
}
