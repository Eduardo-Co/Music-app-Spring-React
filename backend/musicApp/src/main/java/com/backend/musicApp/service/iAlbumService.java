package com.backend.musicApp.service;

import com.backend.musicApp.dto.AlbumDto;
import com.backend.musicApp.dto.ArtistDto;
import com.backend.musicApp.entity.Album;

import java.util.List;
import java.util.Optional;

public interface iAlbumService {
    void createAlbum(AlbumDto albumDto);
    void updateAlbum(AlbumDto albumDto, Long id);
    Optional<AlbumDto> fetchAlbum(Long id);
    Optional<List<AlbumDto>> fetchAlbums();
    void deleteAlbum(Long id);
}
