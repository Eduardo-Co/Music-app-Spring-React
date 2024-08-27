package com.backend.musicApp.service;

import com.backend.musicApp.dto.UserDto;
import com.backend.musicApp.entity.User;

import java.util.Optional;

public interface iUserService {

    void createUser(UserDto user);
    void updateUser(UserDto user, Long id);
    Optional<User> fetchUser(Long id);
    void deleteUser(Long id);
}
