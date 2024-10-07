package com.backend.musicApp.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ImageData")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ImageData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    private String type;

    @Lob
    @Column(name = "imagedata", length = 10000)
    private byte[] imageData;
}
