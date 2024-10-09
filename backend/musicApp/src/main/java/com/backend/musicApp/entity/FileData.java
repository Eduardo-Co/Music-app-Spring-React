package com.backend.musicApp.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "fileData")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FileData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;
    private String type;
    private String filePath;
}
