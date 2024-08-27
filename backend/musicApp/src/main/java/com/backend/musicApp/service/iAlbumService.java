package com.backend.musicApp.service;

import com.backend.musicApp.dto.AlbumDto;
import com.backend.musicApp.entity.Album;

import java.util.Optional;

public interface iAlbumService {
    void createAlbum(AlbumDto albumDto);
    void updateAlbum(AlbumDto albumDto, Long id);
    Optional<Album> fetchAlbum(Long id);
    void deleteAlbum(Long id);
}
