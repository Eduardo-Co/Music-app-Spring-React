package com.backend.musicApp.mapper;

import com.backend.musicApp.dto.UserInfoDto;
import com.backend.musicApp.entity.User;
import org.springframework.stereotype.Component;

import java.time.Instant;

public class UserInfoMapper {

    public static UserInfoDto toDto(User user) {
        if (user == null) {
            return null;
        }

        UserInfoDto userInfoDto = new UserInfoDto();
        userInfoDto.setUserId(user.getUserId());
        userInfoDto.setUserName(user.getUsername());
        userInfoDto.setEmail(user.getEmail());
        userInfoDto.setRoles(user.getRoles());

        return userInfoDto;
    }
}
