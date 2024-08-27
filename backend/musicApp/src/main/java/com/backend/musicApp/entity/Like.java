package com.backend.musicApp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Likes")
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LikeID")
    private Long likeId;

    @ManyToOne
    @JoinColumn(name = "UserID", referencedColumnName = "UserID")
    private User user;

    @ManyToOne
    @JoinColumn(name = "TrackID", referencedColumnName = "TrackID")
    private Track track;

    @Column(name = "Created_At", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}