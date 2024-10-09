package com.backend.musicApp.service;

import com.backend.musicApp.dto.PlaylistDto;
import com.backend.musicApp.entity.Playlist;

import java.util.List;
import java.util.Optional;

public interface iPlaylistService {
    void createPlaylist(PlaylistDto playlistDto);
    void updatePlaylist(PlaylistDto playlistDto, Long id);
    void deletePlaylist(Long id);
    Optional<PlaylistDto> fetchPlaylist(Long id);
    Optional<List<PlaylistDto>> fetchAllPlaylists(Long id);

}
