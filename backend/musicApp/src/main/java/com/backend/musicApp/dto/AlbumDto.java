package com.backend.musicApp.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlbumDto {

    @NotBlank(message = "Title cannot be blank")
    @Size(max = 100, message = "Title must be less than 100 characters")
    private String title;

    @NotNull(message = "Artist ID cannot be null")
    @Positive(message = "Artist ID must be a positive number")
    private Long artistId;

    @NotBlank(message = "Genre cannot be blank")
    @Size(max = 50, message = "Genre must be less than 50 characters")
    private String genre;

    @NotNull(message = "Release date cannot be null")
    @PastOrPresent(message = "Release date cannot be in the future")
    private LocalDate releaseDate;

    private String photoUrl;

    private Long albumId;
}
