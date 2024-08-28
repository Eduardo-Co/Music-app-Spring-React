package com.backend.musicApp.repository;

import com.backend.musicApp.entity.Playlist;
import org.springframework.data.repository.CrudRepository;

public interface PlaylistRepository extends CrudRepository<Playlist, Long> {
}
