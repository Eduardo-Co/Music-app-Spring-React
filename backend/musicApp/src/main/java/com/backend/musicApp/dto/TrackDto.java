package com.backend.musicApp.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrackDto {
    private String title;
    private Long artistId;
    private Long albumId;
    private LocalTime duration;
    private LocalDate releaseDate;
    private String trackLink;
}
