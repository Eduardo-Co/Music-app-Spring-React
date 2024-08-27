package com.backend.musicApp.repository;

import com.backend.musicApp.entity.Track;
import org.springframework.data.repository.CrudRepository;

public interface TrackRepository extends CrudRepository<Track, Long> {
}
