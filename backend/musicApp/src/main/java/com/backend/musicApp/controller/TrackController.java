package com.backend.musicApp.controller;

import com.backend.musicApp.dto.TrackDto;
import com.backend.musicApp.dto.ResponseDto;
import com.backend.musicApp.entity.Track;
import com.backend.musicApp.service.iTrackService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@Validated
@RequestMapping("/track")
public class TrackController {

    private final iTrackService trackService;

    @Autowired
    public TrackController(iTrackService trackService) {
        this.trackService = trackService;
    }

    @PostMapping("/create")
    public ResponseEntity<ResponseDto> createTrack(@Valid @RequestBody TrackDto trackDto,
                                                   @RequestParam("file") MultipartFile file)
    {
        trackService.createTrack(trackDto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ResponseDto("201",
                        LocalDateTime.now().toString(),
                        "Track Created Successfully"));
    }

    @PostMapping("/edit/{id}")
    public ResponseEntity<ResponseDto> editTrack(@Valid @RequestBody TrackDto trackDto, @PathVariable Long id) {
        trackService.updateTrack(trackDto, id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ResponseDto("200",
                        LocalDateTime.now().toString(),
                        "Track Edited Successfully"));
    }

    @GetMapping("/fetch/{id}")
    public ResponseEntity<Optional<Track>> fetchTrack(@PathVariable Long id) {
        Optional<Track> foundTrack = trackService.fetchTrack(id);

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .body(foundTrack);
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<ResponseDto> deleteTrack(@PathVariable Long id) {
        trackService.deleteTrack(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ResponseDto("200",
                        LocalDateTime.now().toString(),
                        "Track Deleted Successfully"));
    }
}
