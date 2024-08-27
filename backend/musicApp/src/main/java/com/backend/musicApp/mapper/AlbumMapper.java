package com.backend.musicApp.mapper;

import com.backend.musicApp.dto.AlbumDto;
import com.backend.musicApp.entity.Album;
import com.backend.musicApp.entity.Artist;
import org.springframework.stereotype.Component;

@Component
public class AlbumMapper {

    public static AlbumDto toDto(Album album) {
        if (album == null) {
            return null;
        }

        AlbumDto albumDto = new AlbumDto();
        albumDto.setTitle(album.getTitle());
        albumDto.setArtistId(album.getArtist().getArtistId());
        albumDto.setGenre(album.getGenre());
        albumDto.setReleaseDate(album.getReleaseDate());
        albumDto.setPhotoUrl(album.getPhotoUrl());


        return albumDto;
    }

    public static Album toEntity(AlbumDto albumDto, Artist artist) {
        if (albumDto == null) {
            return null;
        }

        Album album = new Album();
        album.setTitle(albumDto.getTitle());
        album.setArtist(artist);
        album.setGenre(albumDto.getGenre());
        album.setReleaseDate(albumDto.getReleaseDate());
        album.setPhotoUrl(albumDto.getPhotoUrl());

        return album;
    }
}
