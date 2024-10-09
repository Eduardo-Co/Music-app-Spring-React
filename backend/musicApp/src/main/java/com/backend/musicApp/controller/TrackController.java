package com.backend.musicApp.controller;

import com.backend.musicApp.dto.ResponseDto;
import com.backend.musicApp.dto.TrackDto;
import com.backend.musicApp.entity.FileData;
import com.backend.musicApp.exception.AudioNotFoundException;
import com.backend.musicApp.exception.StorageException;
import com.backend.musicApp.service.StorageService;
import com.backend.musicApp.service.iTrackService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@Validated
@RequestMapping("/track")
public class TrackController {

    private final iTrackService trackService;
    private final StorageService storageService;

    @Autowired
    public TrackController(iTrackService trackService, StorageService storageService) {
        this.trackService = trackService;
        this.storageService = storageService;
    }

    @PostMapping("/create")
    public ResponseEntity<ResponseDto> createTrack(@Valid @ModelAttribute TrackDto trackDto,
                                                   @RequestParam("file") MultipartFile file) throws IOException {
        if(file != null) {
            Optional<FileData> uploadTrack = storageService.uploadImageToFileSystem(file, "tracks");
            if(uploadTrack.isPresent()) {
                trackDto.setTrackLink("http://localhost:8080/storage/tracks/" + uploadTrack.get().getName());
            }else{
                throw new StorageException("File not found");
            }
        }else{
            throw new AudioNotFoundException();
        }
        trackService.createTrack(trackDto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ResponseDto("201",
                        LocalDateTime.now().toString(),
                        "Track Created Successfully"));
    }

    @PostMapping("/edit/{id}")
    public ResponseEntity<ResponseDto> editTrack(@Valid @ModelAttribute TrackDto trackDto,
                                                 @PathVariable Long id,
                                                 @RequestParam(value = "file", required = false) MultipartFile file)
            throws IOException {

        Optional<TrackDto> existingTrack = trackService.fetchTrack(id);
        if (existingTrack.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseDto("404", LocalDateTime.now().toString(), "Track not found"));
        }

        if (file != null && !file.isEmpty()) {
            Optional<FileData> uploadedImage = storageService.uploadImageToFileSystem(file, "tracks");

            String oldPhotoUrl = existingTrack.get().getTrackLink();
            if (oldPhotoUrl != null && !oldPhotoUrl.isEmpty()) {
                storageService.deleteImageFromFileSystem(oldPhotoUrl, "tracks");
            }

            if (uploadedImage.isPresent()) {
                trackDto.setTrackLink("http://localhost:8080/storage/tracks/" + uploadedImage.get().getName());
            } else {
                throw new StorageException("Não foi possível salvar a música.");
            }
        } else {
            trackDto.setTrackLink(existingTrack.get().getTrackLink());
        }
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ResponseDto("200",
                        LocalDateTime.now().toString(),
                        "Track Edited Successfully"));
    }


    @GetMapping("/fetch/{id}")
    public ResponseEntity<Optional<TrackDto>> fetchTrack(@PathVariable Long id) {
        Optional<TrackDto> foundTrack = trackService.fetchTrack(id);

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .body(foundTrack);
    }
    @GetMapping("/fetch")
    public ResponseEntity<List<TrackDto>> fetchArtists() {
        List<TrackDto> foundTracks = trackService.fetchTracks().orElse(Collections.emptyList());
        return ResponseEntity.status(HttpStatus.OK).body(foundTracks);
    }


    @PostMapping("/delete/{id}")
    public ResponseEntity<ResponseDto> deleteTrack(@PathVariable Long id) {

        Optional<TrackDto> trackDto = trackService.fetchTrack(id);
        trackService.deleteTrack(id);

        if (trackDto.isPresent() && trackDto.get().getTrackLink() != null) {
            String photoUrl = trackDto.get().getTrackLink();
            String fileName = photoUrl.substring(photoUrl.lastIndexOf("albums/") + "albums/".length());

            try {
                storageService.deleteImageFromFileSystem(fileName, "albums");
            } catch (IOException e) {
                System.err.println("Erro ao excluir a música: " + e.getMessage());
            }
        }
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ResponseDto("200", LocalDateTime.now().toString(),"Track Deleted Successfully"));

    }
}
