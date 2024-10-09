package com.backend.musicApp.dto;

import com.backend.musicApp.entity.FileData;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArtistDto {

    @NotBlank(message = "Name cannot be blank")
    @Size(max = 100, message = "Name must be less than 100 characters")
    private String name;

    @NotBlank(message = "Genre cannot be blank")
    @Size(max = 50, message = "Genre must be less than 50 characters")
    private String genre;

    private String photoUrl;

    private Long artistId;

}
