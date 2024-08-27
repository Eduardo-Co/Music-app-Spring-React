package com.backend.musicApp.repository;

import com.backend.musicApp.entity.Artist;
import org.springframework.data.repository.CrudRepository;

public interface ArtistRepository extends CrudRepository<Artist, Long> {
}
