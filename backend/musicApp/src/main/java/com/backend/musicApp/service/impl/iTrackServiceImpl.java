package com.backend.musicApp.service.impl;

import com.backend.musicApp.dto.TrackDto;
import com.backend.musicApp.entity.Album;
import com.backend.musicApp.entity.Artist;
import com.backend.musicApp.entity.Track;
import com.backend.musicApp.exception.ResourceNotFoundException;
import com.backend.musicApp.mapper.TrackMapper;
import com.backend.musicApp.repository.AlbumRepository;
import com.backend.musicApp.repository.ArtistRepository;
import com.backend.musicApp.repository.TrackRepository;
import com.backend.musicApp.service.iTrackService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class iTrackServiceImpl implements iTrackService {

    private final TrackRepository trackRepository;
    private final ArtistRepository artistRepository;
    private final AlbumRepository albumRepository;

    public iTrackServiceImpl(TrackRepository trackRepository,
                             ArtistRepository artistRepository,
                             AlbumRepository albumRepository)
    {
        this.trackRepository = trackRepository;
        this.artistRepository = artistRepository;
        this.albumRepository = albumRepository;
    }

    @Override
    public void createTrack(TrackDto trackDto) {

        Optional<Album> foundAlbum = albumRepository.findById(trackDto.getAlbumId());
        Optional<Artist> foundArtist = artistRepository.findById(trackDto.getArtistId());

        if (foundAlbum.isPresent() && foundArtist.isPresent()) {
            Track track = TrackMapper.toEntity(trackDto, foundArtist.get(), foundAlbum.get());
            trackRepository.save(track);
        } else {
            throw new ResourceNotFoundException
                    ("Album or Artist", "Id",trackDto.getAlbumId().toString()+","+trackDto.getArtistId().toString());
        }
    }

    @Override
    public void updateTrack(TrackDto trackDto, Long id) {

        Optional<Track> foundTrackOptional = trackRepository.findById(id);

        if (foundTrackOptional.isPresent()) {
            Track track = foundTrackOptional.get();
            track.setTitle(trackDto.getTitle());
            track.setDuration(trackDto.getDuration());
            track.setReleaseDate(trackDto.getReleaseDate());
            track.setTrackLink(trackDto.getTrackLink());

            Optional<Album> albumOptional = albumRepository.findById(trackDto.getAlbumId());
            Optional<Artist> artistOptional = artistRepository.findById(trackDto.getArtistId());

            if (albumOptional.isPresent() && artistOptional.isPresent()) {
                track.setAlbum(albumOptional.get());
                trackRepository.save(track);
            } else {
                throw new ResourceNotFoundException
                        ("Album or Artist", "Id",trackDto.getAlbumId().toString()+","+trackDto.getArtistId().toString());
            }
        } else {
            throw new ResourceNotFoundException("Track", "Id", id.toString());
        }
    }

    @Override
    public Optional<Track> fetchTrack(Long id) {
        Optional<Track> foundTrack = trackRepository.findById(id);

        if (foundTrack.isPresent()) {
            return foundTrack;
        } else {
            throw new ResourceNotFoundException("Track", "Id", id.toString());
        }
    }

    @Override
    public void deleteTrack(Long id) {
        Optional<Track> track = trackRepository.findById(id);

        if (track.isPresent()) {
            trackRepository.delete(track.get());
        } else {
            throw new ResourceNotFoundException("Track", "Id", id.toString());
        }
    }
}
