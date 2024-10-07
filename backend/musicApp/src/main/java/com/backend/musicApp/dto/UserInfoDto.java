package com.backend.musicApp.dto;

import com.backend.musicApp.entity.Roles;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDto {

    private Instant expiresIn;
    private Long userId;
    private Set<Roles> roles;
    private String userName;
    private String email;

}
