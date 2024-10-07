package com.backend.musicApp.mapper;

import com.backend.musicApp.dto.UserDto;
import com.backend.musicApp.entity.User;

public class UserMapper {

    public static UserDto toUserDTO(User user) {

        if (user == null) {
            return null;
        }

        UserDto userDto = new UserDto();
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        userDto.setPhotoUrl(user.getPhotoUrl());


        return userDto;
    }

    public static User toUser(UserDto userDto) {
        if (userDto == null) {
            return null;
        }

        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setPhotoUrl(userDto.getPhotoUrl());
        user.setPassword(userDto.getPassword());
        return user;
    }
}