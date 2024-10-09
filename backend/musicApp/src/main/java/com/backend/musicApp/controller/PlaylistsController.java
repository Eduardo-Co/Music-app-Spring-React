package com.backend.musicApp.controller;

import com.backend.musicApp.dto.PlaylistDto;
import com.backend.musicApp.service.iPlaylistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// Controlador separado para múltiplas playlists
@RestController
@Validated
@RequestMapping("/playlists")
public class PlaylistsController {

    private final iPlaylistService playlistService;

    @Autowired
    public PlaylistsController(iPlaylistService playlistService) {
        this.playlistService = playlistService;
    }

    @GetMapping("/fetch/{id}")
    public ResponseEntity<Optional<List<PlaylistDto>>> fetchPlaylists(@PathVariable Long id){
        Optional<List<PlaylistDto>> foundPlaylists;

        foundPlaylists = playlistService.fetchAllPlaylists(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(foundPlaylists);
    }
}
