package com.backend.musicApp.controller;

import com.backend.musicApp.dto.AlbumDto;
import com.backend.musicApp.dto.ResponseDto;
import com.backend.musicApp.entity.Album;
import com.backend.musicApp.service.iAlbumService;
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
@RequestMapping("/album")
public class AlbumController {

    private final iAlbumService albumService;

    @Autowired
    public AlbumController(iAlbumService albumService) {
        this.albumService = albumService;
    }

    @PostMapping("/create")
    public ResponseEntity<ResponseDto> createAlbum(@Valid @RequestBody AlbumDto albumDto) {
        albumService.createAlbum(albumDto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ResponseDto("201", LocalDateTime.now().toString(), "Album Created Successfully"));
    }

    @PostMapping("/edit/{id}")
    public ResponseEntity<ResponseDto> editAlbum(@Valid @RequestBody AlbumDto albumDto, @PathVariable Long id) {
        albumService.updateAlbum(albumDto, id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ResponseDto("200", LocalDateTime.now().toString(), "Album Edited Successfully"));
    }

    @GetMapping("/fetch/{id}")
    public ResponseEntity<Optional<Album>> fetchAlbum(@PathVariable Long id) {
        Optional<Album> foundAlbum = albumService.fetchAlbum(id);

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .body(foundAlbum);
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<ResponseDto> deleteAlbum(@PathVariable Long id) {
        albumService.deleteAlbum(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ResponseDto("200", LocalDateTime.now().toString(), "Album Deleted Successfully"));
    }
}
