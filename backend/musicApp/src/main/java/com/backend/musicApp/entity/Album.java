package com.backend.musicApp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Album") @Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class Album {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long albumId;

    @Column(nullable = false, length = 255)
    private String title;

    @ManyToOne
    @JoinColumn(name = "artist_id", referencedColumnName = "artistId")
    private Artist artist;

    @Column(nullable = false, length = 255)
    private String genre;

    @Column(name = "release_date", nullable = false)
    private LocalDate releaseDate;

    @Column(name = "photo_url", length = 255)
    private String photoUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
