package com.backend.musicApp.mapper;

import com.backend.musicApp.dto.TrackDto;
import com.backend.musicApp.entity.Track;
import com.backend.musicApp.entity.Artist;
import com.backend.musicApp.entity.Album;

public class TrackMapper {

    public static Track toEntity(TrackDto trackDto, Artist artist, Album album) {
        if (trackDto == null) {
            return null;
        }

        Track track = new Track();
        track.setTitle(trackDto.getTitle());
        track.setTrackLink(trackDto.getTrackLink());
        track.setDuration(trackDto.getDuration());
        track.setReleaseDate(trackDto.getReleaseDate());
        track.setArtist(artist);
        track.setAlbum(album);
        return track;
    }

    public static TrackDto toDto(Track track) {
        if (track == null) {
            return null;
        }

        TrackDto trackDto = new TrackDto();
        trackDto.setTitle(track.getTitle());
        trackDto.setTrackLink(track.getTrackLink());
        trackDto.setDuration(track.getDuration());
        trackDto.setReleaseDate(track.getReleaseDate());
        trackDto.setArtistId(track.getArtist() != null ? track.getArtist().getArtistId() : null);
        trackDto.setAlbumId(track.getAlbum() != null ? track.getAlbum().getAlbumId() : null);
        return trackDto;
    }
}
