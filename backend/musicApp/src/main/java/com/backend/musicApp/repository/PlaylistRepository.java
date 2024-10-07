package com.backend.musicApp.repository;

import com.backend.musicApp.entity.Playlist;
import com.backend.musicApp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {

    List<Playlist> findByUser(User user);

}

