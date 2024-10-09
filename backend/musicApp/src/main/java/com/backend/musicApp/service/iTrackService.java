package com.backend.musicApp.service;

import com.backend.musicApp.dto.AlbumDto;
import com.backend.musicApp.dto.TrackDto;
import com.backend.musicApp.entity.Track;

import java.util.List;
import java.util.Optional;

public interface iTrackService {
    void createTrack(TrackDto trackDto);
    void updateTrack(TrackDto trackDto, Long id);
    Optional<TrackDto> fetchTrack(Long id);
    Optional<List<TrackDto>> fetchTracks();
    void deleteTrack(Long id);
}
