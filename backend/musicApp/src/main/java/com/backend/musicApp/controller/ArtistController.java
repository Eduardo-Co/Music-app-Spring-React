package com.backend.musicApp.controller;


import com.backend.musicApp.dto.ArtistDto;
import com.backend.musicApp.dto.ResponseDto;
import com.backend.musicApp.entity.FileData;
import com.backend.musicApp.exception.StorageException;
import com.backend.musicApp.service.StorageService;
import com.backend.musicApp.service.iArtistService;
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
@RequestMapping("/artist")
public class ArtistController {


    private final iArtistService artistService;

    @Autowired
    private final StorageService storageService;

    @Autowired
    public ArtistController(iArtistService artistService, StorageService storageService) {
        this.artistService = artistService;
        this.storageService = storageService;
    }

    @PostMapping("/create")
    public ResponseEntity<ResponseDto> createArtist(@Valid @ModelAttribute ArtistDto artistDto,
                                                    @RequestParam(value = "file", required = false) MultipartFile file)
                                                    throws IOException {
        if (file != null) {
            Optional<FileData> uploadImage = storageService.uploadImageToFileSystem(file, "artists");

            if (uploadImage != null && uploadImage.isPresent()) {
                artistDto.setPhotoUrl("http://localhost:8080/storage/artists/" + uploadImage.get().getName());
            } else {
                throw new StorageException("Não foi possível salvar a imagem");
            }
        }
        artistService.createArtist(artistDto);

        return  ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ResponseDto("201", LocalDateTime.now().toString(),
                        "Artist Created Sucessfully"));
    }


    @PostMapping("/edit/{id}")
    public ResponseEntity<ResponseDto> editArtist(@PathVariable Long id,
                                                  @Valid @ModelAttribute ArtistDto artistDto,
                                                  @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {

        Optional<ArtistDto> existingArtist = artistService.fetchArtist(id);

        if (existingArtist.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseDto("404", LocalDateTime.now().toString(), "Artist not found"));
        }

        if (file != null && !file.isEmpty()) {
            Optional<FileData> uploadedImage = storageService.uploadImageToFileSystem(file, "artists");

            String oldPhotoUrl = existingArtist.get().getPhotoUrl();
            if (oldPhotoUrl != null && !oldPhotoUrl.isEmpty()) {
                storageService.deleteImageFromFileSystem(oldPhotoUrl, "artists");
            }

            if (uploadedImage.isPresent()) {
                artistDto.setPhotoUrl("http://localhost:8080/storage/artists/" + uploadedImage.get().getName());
            } else {
                throw new StorageException("Não foi possível salvar a imagem.");
            }
        } else {
            artistDto.setPhotoUrl(existingArtist.get().getPhotoUrl());
        }

        artistService.updateArtist(artistDto, id);

        return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseDto("201", LocalDateTime.now().toString(), "Artist edited successfully"));
    }


    @GetMapping("/fetch/{id}")
    public ResponseEntity<ArtistDto> fetchArtist(@PathVariable Long id) {

        Optional<ArtistDto> foundArtist = artistService.fetchArtist(id);

        return foundArtist.map(artistDto -> ResponseEntity
                        .status(HttpStatus.OK)
                        .body(artistDto))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }


    @GetMapping("/fetch")
    public ResponseEntity<List<ArtistDto>> fetchArtists() {
        List<ArtistDto> foundArtists = artistService.fetchArtists().orElse(Collections.emptyList());
        return ResponseEntity.status(HttpStatus.OK).body(foundArtists);
    }



    @PostMapping("/delete/{id}")
    public ResponseEntity<ResponseDto> deleteArtist(@PathVariable Long id) throws IOException {
        Optional<ArtistDto> artist = artistService.fetchArtist(id);

        artistService.deleteArtist(id);

        if (artist.isPresent() && artist.get().getPhotoUrl() != null) {
            String photoUrl = artist.get().getPhotoUrl();
            String fileName = photoUrl.substring(photoUrl.lastIndexOf("artists/") + "artists/".length());
            System.out.println(fileName);
            try {
                storageService.deleteImageFromFileSystem(fileName, "artists");
            } catch (IOException e) {
                System.err.println("Erro ao excluir a imagem: " + e.getMessage());
            }
        }

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ResponseDto("201",
                        LocalDateTime.now().toString(),
                        "Artist Deleted Successfully"));
    }
}