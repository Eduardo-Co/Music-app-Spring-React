package com.backend.musicApp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "Track") @Getter @Setter
public class Track {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long trackId;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "track_link", nullable = false, length = 255)
    private String trackLink;

    @ManyToOne
    @JoinColumn(name = "artist_id", referencedColumnName = "artistId")
    private Artist artist;

    @ManyToOne
    @JoinColumn(name = "album_id", referencedColumnName = "albumId")
    private Album album;

    @Column(nullable = false)
    private LocalTime duration;

    @Column(name = "release_date", nullable = false)
    private LocalDate releaseDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
