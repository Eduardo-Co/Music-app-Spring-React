package com.backend.musicApp.mapper;

import com.backend.musicApp.dto.ArtistDto;
import com.backend.musicApp.entity.Artist;
import org.springframework.stereotype.Component;

@Component
public class ArtistMapper {

    public static ArtistDto toDto(Artist artist) {
        if (artist == null) {
            return null;
        }

        ArtistDto artistDto = new ArtistDto();
        artistDto.setName(artist.getName());
        artistDto.setGenre(artist.getGenre());
        artistDto.setPhotoUrl(artist.getPhotoUrl());

        return artistDto;
    }

    public static Artist toEntity(ArtistDto artistDto) {
        if (artistDto == null) {
            return null;
        }

        Artist artist = new Artist();
        artist.setName(artistDto.getName());
        artist.setGenre(artistDto.getGenre());
        artist.setPhotoUrl(artistDto.getPhotoUrl());

        return artist;
    }
}
