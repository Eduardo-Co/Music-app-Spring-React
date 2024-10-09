package com.backend.musicApp.service.impl;

import com.backend.musicApp.dto.ArtistDto;
import com.backend.musicApp.entity.Artist;
import com.backend.musicApp.entity.FileData;
import com.backend.musicApp.exception.ResourceNotFoundException;
import com.backend.musicApp.mapper.ArtistMapper;
import com.backend.musicApp.repository.ArtistRepository;
import com.backend.musicApp.service.iArtistService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class iArtistServiceImpl implements iArtistService {

    private final ArtistRepository artistRepository;

    public iArtistServiceImpl(ArtistRepository artistRepository) {
        this.artistRepository = artistRepository;
    }

    @Override
    public void createArtist(ArtistDto artistDto) {
        Artist artist = ArtistMapper.toEntity(artistDto);
        artistRepository.save(artist);
    }

    @Override
    public void updateArtist(ArtistDto artistDto, Long id) {

        Artist updatedArtist = ArtistMapper.toEntity(artistDto);
        Optional<Artist> foundArtist = artistRepository.findById(id);

        if(foundArtist.isPresent()) {

            foundArtist.get().setName(updatedArtist.getName());
            foundArtist.get().setGenre(updatedArtist.getGenre());
            foundArtist.get().setPhotoUrl(updatedArtist.getPhotoUrl());


            artistRepository.save(foundArtist.get());

        }else {
            throw new ResourceNotFoundException("Artist", "Id", id.toString());
        }
    }

    @Override
    public Optional<ArtistDto> fetchArtist(Long id) {
        Artist foundArtist = artistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Artist", "Id", id.toString()));

        return Optional.of(ArtistMapper.toDto(foundArtist));
    }

    @Override
    public Optional<List<ArtistDto>> fetchArtists() {
        Iterable<Artist> foundedArtists = artistRepository.findAll();
        List<ArtistDto> artistDtos = new ArrayList<>();

        for (Artist artist : foundedArtists) {
            artistDtos.add(ArtistMapper.toDto(artist));
        }

        return artistDtos.isEmpty() ? Optional.empty() : Optional.of(artistDtos);
    }

    @Override
    public void deleteArtist(Long id) {
        Optional<Artist> artist = artistRepository.findById(id);

        if(artist.isPresent()) {
            artistRepository.delete(artist.get());
        }else{
            throw new ResourceNotFoundException("Artist", "Id", id.toString());
        }
    }
}

