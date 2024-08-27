package com.backend.musicApp.repository;

import com.backend.musicApp.entity.Album;
import com.backend.musicApp.entity.Artist;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface AlbumRepository extends CrudRepository<Album, Long> {

    List<Album> findByArtist(Artist artist);

}
