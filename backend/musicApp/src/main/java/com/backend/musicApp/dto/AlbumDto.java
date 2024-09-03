package com.backend.musicApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


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
