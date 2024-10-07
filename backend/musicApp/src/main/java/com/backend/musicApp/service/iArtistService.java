package com.backend.musicApp.service;

import com.backend.musicApp.dto.ArtistDto;
import com.backend.musicApp.entity.Artist;
import com.backend.musicApp.entity.Artist;

import java.util.List;
import java.util.Optional;

public interface iArtistService {
    void createArtist(ArtistDto user);
    void updateArtist(ArtistDto user, Long id);
    Optional<ArtistDto> fetchArtist(Long id);
    Optional<List<ArtistDto>> fetchArtists();
    void deleteArtist(Long id);
}
