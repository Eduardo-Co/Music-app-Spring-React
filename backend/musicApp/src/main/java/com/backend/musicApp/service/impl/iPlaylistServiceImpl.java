package com.backend.musicApp.service.impl;

import com.backend.musicApp.dto.PlaylistDto;
import com.backend.musicApp.entity.Playlist;
import com.backend.musicApp.entity.User;
import com.backend.musicApp.exception.ResourceNotFoundException;
import com.backend.musicApp.mapper.PlaylistMapper;
import com.backend.musicApp.repository.PlaylistRepository;
import com.backend.musicApp.repository.UserRepository;
import com.backend.musicApp.service.iPlaylistService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class iPlaylistServiceImpl implements iPlaylistService {

    private final PlaylistRepository playlistRepository;
    private final UserRepository userRepository;

    public iPlaylistServiceImpl(PlaylistRepository playlistRepository, UserRepository userRepository) {
        this.playlistRepository = playlistRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void createPlaylist(PlaylistDto playlistDto) {
        User user = userRepository.findById(playlistDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "Id", playlistDto.getUserId().toString()));
        Playlist playlist = PlaylistMapper.toEntity(playlistDto, user);
        playlistRepository.save(playlist);
    }

    @Override
    public void updatePlaylist(PlaylistDto playlistDto, Long id) {
        Optional<Playlist> foundPlaylist = playlistRepository.findById(id);

        if (foundPlaylist.isPresent()) {
            User user = userRepository.findById(playlistDto.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "Id", playlistDto.getUserId().toString()));

            Playlist updatedPlaylist = PlaylistMapper.toEntity(playlistDto, user);
            Playlist existingPlaylist = foundPlaylist.get();

            existingPlaylist.setTitle(updatedPlaylist.getTitle());
            existingPlaylist.setUser(updatedPlaylist.getUser());
            existingPlaylist.setUpdatedAt(LocalDateTime.now());

            playlistRepository.save(existingPlaylist);

        } else {
            throw new ResourceNotFoundException("Playlist", "Id", id.toString());
        }
    }

    @Override
    public Optional<Playlist> fetchPlaylist(Long id) {
        Optional<Playlist> foundPlaylist = playlistRepository.findById(id);

        if (foundPlaylist.isPresent()) {
            return foundPlaylist;
        } else {
            throw new ResourceNotFoundException("Playlist", "Id", id.toString());
        }
    }

    @Override
    public void deletePlaylist(Long id) {
        Optional<Playlist> playlist = playlistRepository.findById(id);

        if (playlist.isPresent()) {
            playlistRepository.delete(playlist.get());
        } else {
            throw new ResourceNotFoundException("Playlist", "Id", id.toString());
        }
    }
}
