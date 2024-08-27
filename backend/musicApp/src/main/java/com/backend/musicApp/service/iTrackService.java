package com.backend.musicApp.service;

import com.backend.musicApp.dto.TrackDto;
import com.backend.musicApp.entity.Track;

import java.util.Optional;

public interface iTrackService {
    void createTrack(TrackDto trackDto);
    void updateTrack(TrackDto trackDto, Long id);
    Optional<Track> fetchTrack(Long id);
    void deleteTrack(Long id);
}
