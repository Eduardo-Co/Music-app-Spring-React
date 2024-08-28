package com.backend.musicApp.controller;

import com.backend.musicApp.dto.PlaylistDto;
import com.backend.musicApp.dto.ResponseDto;
import com.backend.musicApp.entity.Playlist;
import com.backend.musicApp.service.iPlaylistService;
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
@RequestMapping("/playlist")
public class PlaylistController {

    private final iPlaylistService playlistService;

    @Autowired
    public PlaylistController(iPlaylistService playlistService) {
        this.playlistService = playlistService;
    }

    @PostMapping("/create")
    public ResponseEntity<ResponseDto> createPlaylist(@Valid @RequestBody PlaylistDto playlistDto) {
        playlistService.createPlaylist(playlistDto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ResponseDto("201", LocalDateTime.now().toString(), "Playlist Created Successfully"));
    }

    @PostMapping("/edit/{id}")
    public ResponseEntity<ResponseDto> editPlaylist(@Valid @RequestBody PlaylistDto playlistDto, @PathVariable Long id) {
        playlistService.updatePlaylist(playlistDto, id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ResponseDto("200", LocalDateTime.now().toString(), "Playlist Edited Successfully"));
    }

    @GetMapping("/fetch/{id}")
    public ResponseEntity<Optional<Playlist>> fetchPlaylist(@PathVariable Long id) {
        Optional<Playlist> foundPlaylist = playlistService.fetchPlaylist(id);

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .body(foundPlaylist);
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<ResponseDto> deletePlaylist(@PathVariable Long id) {
        playlistService.deletePlaylist(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ResponseDto("200", LocalDateTime.now().toString(), "Playlist Deleted Successfully"));
    }
}
