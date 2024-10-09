package com.backend.musicApp.service.impl;

import com.backend.musicApp.dto.AlbumDto;
import com.backend.musicApp.dto.ArtistDto;
import com.backend.musicApp.entity.Album;
import com.backend.musicApp.entity.Artist;
import com.backend.musicApp.exception.ResourceNotFoundException;
import com.backend.musicApp.mapper.AlbumMapper;
import com.backend.musicApp.mapper.ArtistMapper;
import com.backend.musicApp.repository.AlbumRepository;
import com.backend.musicApp.repository.ArtistRepository;
import com.backend.musicApp.service.iAlbumService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class iAlbumServiceImpl implements iAlbumService {

    private final AlbumRepository albumRepository;
    private final ArtistRepository artistRepository;

    public iAlbumServiceImpl(AlbumRepository albumRepository, ArtistRepository artistRepository) {
        this.albumRepository = albumRepository;
        this.artistRepository = artistRepository;
    }

    @Override
    public void createAlbum(AlbumDto albumDto) {

        Optional<Artist> foundArtist = artistRepository.findById(albumDto.getArtistId());
        if(foundArtist.isPresent()) {
            Album album = AlbumMapper.toEntity(albumDto, foundArtist.get());
            albumRepository.save(album);

        }else {
            throw new ResourceNotFoundException("Artist", "Id", albumDto.getArtistId().toString());
        }
    }

    @Override
    public void updateAlbum(AlbumDto albumDto, Long id) {
        Optional<Album> foundAlbumOptional = albumRepository.findById(id);

        if (foundAlbumOptional.isPresent()) {
            Album album = foundAlbumOptional.get();

            album.setTitle(albumDto.getTitle());
            album.setGenre(albumDto.getGenre());
            album.setPhotoUrl(albumDto.getPhotoUrl());
            album.setReleaseDate(albumDto.getReleaseDate());

            Optional<Artist> artistOptional = artistRepository.findById(albumDto.getArtistId());

            if (artistOptional.isPresent()) {
                album.setArtist(artistOptional.get());
                albumRepository.save(album);
            } else {
                throw new ResourceNotFoundException("Artist", "Id", albumDto.getArtistId().toString());
            }
        } else {
            throw new ResourceNotFoundException("Album", "Id", id.toString());
        }
    }

    @Override
    public Optional<AlbumDto> fetchAlbum(Long id) {
        Optional<Album> foundAlbum = albumRepository.findById(id);

        if (foundAlbum.isPresent()) {
            AlbumDto albumDto = AlbumMapper.toDto(foundAlbum.get());
            return Optional.of(albumDto);
        } else {
            throw new ResourceNotFoundException("Album", "Id", id.toString());
        }
    }

    @Override
    public Optional<List<AlbumDto>> fetchAlbums() {
        Iterable<Album> foundedAlbums = albumRepository.findAll();
        List<AlbumDto> albumsDto = new ArrayList<>();

        for (Album album : foundedAlbums) {
            albumsDto.add(AlbumMapper.toDto(album));
        }

        return albumsDto.isEmpty() ? Optional.empty() : Optional.of(albumsDto);
    }


    @Override
    public void deleteAlbum(Long id) {
        Optional<Album> album = albumRepository.findById(id);

        if (album.isPresent()) {
            albumRepository.delete(album.get());
        } else {
            throw new ResourceNotFoundException("Album", "Id", id.toString());
        }
    }
}
