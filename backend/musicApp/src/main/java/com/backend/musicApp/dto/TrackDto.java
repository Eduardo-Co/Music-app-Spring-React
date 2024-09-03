package com.backend.musicApp.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrackDto {

    @NotBlank(message = "Title cannot be blank")
    @Size(max = 100, message = "Title must be less than 100 characters")
    private String title;

    @NotNull(message = "Artist ID cannot be null")
    @Positive(message = "Artist ID must be a positive number")
    private Long artistId;

    @NotNull(message = "Album ID cannot be null")
    @Positive(message = "Album ID must be a positive number")
    private Long albumId;

    @NotNull(message = "Duration cannot be null")
    private LocalTime duration;

    @NotNull(message = "Release date cannot be null")
    @PastOrPresent(message = "Release date cannot be in the future")
    private LocalDate releaseDate;

    @NotBlank(message = "Track link cannot be blank")
    @Size(max = 200, message = "Track link must be less than 200 characters")
    private String trackLink;
}
