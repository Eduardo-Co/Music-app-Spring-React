package com.backend.musicApp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthDto {

    @Email(message = "Email deve ser válido")
    @NotBlank(message = "Email não pode estar em branco")
    private String email;

    @NotBlank(message = "Senha não pode estar em branco")
    @Size(min = 6, max = 20, message = "Senha deve ter entre 6 e 20 caracteres")
    private String password;
}
