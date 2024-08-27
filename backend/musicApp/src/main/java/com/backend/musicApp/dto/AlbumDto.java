package com.backend.musicApp.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlbumDto {
    private String title;
    private Long artistId;
    private String genre;
    private LocalDate releaseDate;
    private String photoUrl;
}
