package com.backend.musicApp.mapper;

import com.backend.musicApp.dto.PlaylistDto;
import com.backend.musicApp.entity.Playlist;
import com.backend.musicApp.entity.User;

public class PlaylistMapper {

    public static PlaylistDto toDto(Playlist playlist) {
        return new PlaylistDto(
                playlist.getPlaylistId(),
                playlist.getUser() != null ? playlist.getUser().getUserId() : null,
                playlist.getTitle()
        );
    }

    public static Playlist toEntity(PlaylistDto playlistDto, User user) {
        Playlist playlist = new Playlist();
        playlist.setPlaylistId(playlistDto.getPlaylistId());
        playlist.setUser(user);
        playlist.setTitle(playlistDto.getTitle());
        return playlist;
    }
}
