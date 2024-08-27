package com.backend.musicApp.controller;


import com.backend.musicApp.dto.ArtistDto;
import com.backend.musicApp.dto.ResponseDto;
import com.backend.musicApp.entity.Artist;
import com.backend.musicApp.service.iArtistService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@Validated
@RequestMapping("/artist")
public class ArtistController {


    private final iArtistService artistService;

    @Autowired
    public ArtistController(iArtistService artistService) {
        this.artistService = artistService;
    }

    @PostMapping("/create")
    public ResponseEntity<ResponseDto> createArtist(@Valid @RequestBody ArtistDto userDto){

        artistService.createArtist(userDto);

        return  ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ResponseDto("201", LocalDateTime.now().toString(), "Artist Created Sucessfully"));
    }

    @PostMapping("/edit/{id}")
    public ResponseEntity<ResponseDto> editArtist(@Valid @RequestBody ArtistDto userDto, @PathVariable Long id){

        artistService.updateArtist(userDto,id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ResponseDto("201", LocalDateTime.now().toString(), "Artist Edited Sucessfully"));
    }

    @GetMapping("/fetch/{id}")
    public ResponseEntity<Optional<Artist>> fetchArtist(@PathVariable Long id){

        Optional<Artist> foundArtist = artistService.fetchArtist(id);

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .body(foundArtist);
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<ResponseDto> deleteArtist(@PathVariable Long id){

        artistService.deleteArtist(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ResponseDto("201", LocalDateTime.now().toString(), "Artist Deleted Sucessfully"));
    }
}
