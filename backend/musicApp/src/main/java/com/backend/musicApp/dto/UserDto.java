package com.backend.musicApp.dto;

import com.backend.musicApp.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    @NotBlank(message = "Username is required")
    @Size(max = 255, message = "Username cannot exceed 255 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 255, message = "Email cannot exceed 255 characters")
    private String email;

    @NotNull(message = "Role is required")
    private Role role;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 255, message = "Password must be between 8 and 255 characters")
    private String password;

    @Size(max = 255, message = "Photo URL cannot exceed 255 characters")
    private String photoUrl;
}
