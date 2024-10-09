package com.backend.musicApp.controller;

import com.backend.musicApp.dto.AlbumDto;
import com.backend.musicApp.dto.ResponseDto;
import com.backend.musicApp.entity.FileData;
import com.backend.musicApp.exception.StorageException;
import com.backend.musicApp.service.StorageService;
import com.backend.musicApp.service.iAlbumService;
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
@RequestMapping("/album")
public class AlbumController {

    private final iAlbumService albumService;
    private final StorageService storageService;

    @Autowired
    public AlbumController(iAlbumService albumService, StorageService storageService) {
        this.albumService = albumService;
        this.storageService = storageService;
    }

    @PostMapping("/create")
    public ResponseEntity<ResponseDto> createAlbum(@Valid @ModelAttribute AlbumDto albumDto,
                                                   @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {
        if (file != null) {
            Optional<FileData> uploadImage = storageService.uploadImageToFileSystem(file, "albums");

            if (uploadImage.isPresent()) {
                albumDto.setPhotoUrl("http://localhost:8080/storage/albums/" + uploadImage.get().getName());
            } else {
                throw new StorageException("Não foi possível salvar a imagem");
            }
        }
        albumService.createAlbum(albumDto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ResponseDto("201", LocalDateTime.now().toString(), "Album Created Successfully"));
    }

    @PostMapping("/edit/{id}")
    public ResponseEntity<ResponseDto> editAlbum(@PathVariable Long id,
                                                 @Valid @ModelAttribute AlbumDto albumDto,
                                                 @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {

        Optional<AlbumDto> existingAlbum = albumService.fetchAlbum(id);

        if (existingAlbum.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseDto("404", LocalDateTime.now().toString(), "Album not found"));
        }

        if (file != null && !file.isEmpty()) {
            Optional<FileData> uploadedImage = storageService.uploadImageToFileSystem(file, "albums");

            String oldPhotoUrl = existingAlbum.get().getPhotoUrl();
            if (oldPhotoUrl != null && !oldPhotoUrl.isEmpty()) {
                storageService.deleteImageFromFileSystem(oldPhotoUrl, "albums");
            }

            if (uploadedImage.isPresent()) {
                albumDto.setPhotoUrl("http://localhost:8080/storage/albums/" + uploadedImage.get().getName());
            } else {
                throw new StorageException("Não foi possível salvar a imagem.");
            }
        } else {
            albumDto.setPhotoUrl(existingAlbum.get().getPhotoUrl());
        }

        albumService.updateAlbum(albumDto, id);

        return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseDto("200", LocalDateTime.now().toString(), "Album Edited Successfully"));
    }

    @GetMapping("/fetch/{id}")
    public ResponseEntity<Optional<AlbumDto>> fetchAlbum(@PathVariable Long id) {
        Optional<AlbumDto> foundAlbum = albumService.fetchAlbum(id);
        return ResponseEntity.status(HttpStatus.OK).body(foundAlbum);
    }


    @GetMapping("/fetch")
    public ResponseEntity<List<AlbumDto>> fetchAlbums() {
        List<AlbumDto> foundAlbums = albumService.fetchAlbums().orElse(Collections.emptyList());
        return ResponseEntity.status(HttpStatus.OK).body(foundAlbums);
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<ResponseDto> deleteAlbum(@PathVariable Long id) {
        Optional<AlbumDto> album = albumService.fetchAlbum(id);

        albumService.deleteAlbum(id);

        if (album.isPresent() && album.get().getPhotoUrl() != null) {
            String photoUrl = album.get().getPhotoUrl();
            String fileName = photoUrl.substring(photoUrl.lastIndexOf("albums/") + "albums/".length());

            try {
                storageService.deleteImageFromFileSystem(fileName, "albums");
            } catch (IOException e) {
                System.err.println("Erro ao excluir a imagem: " + e.getMessage());
            }
        }
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ResponseDto("200", LocalDateTime.now().toString(), "Album Deleted Successfully"));
    }
}
