package com.backend.musicApp.controller;


import com.backend.musicApp.dto.ResponseDto;
import com.backend.musicApp.dto.UserDto;
import com.backend.musicApp.entity.User;
import com.backend.musicApp.service.iUserService;
import jakarta.validation.Valid;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@Validated
@RequestMapping("/user")
public class UserController {


    private final iUserService userService;

    @Autowired
    public UserController(iUserService userService) {
        this.userService = userService;
    }

    @PostMapping("/create")
    public ResponseEntity<ResponseDto> createUser(@Valid @RequestBody UserDto userDto){

        userService.createUser(userDto);

        return  ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ResponseDto("201", LocalDateTime.now().toString(), "User Created Sucessfully"));
    }

    @PostMapping("/edit/{id}")
    public ResponseEntity<ResponseDto> editUser(@Valid @RequestBody UserDto userDto, @PathVariable Long id){

        userService.updateUser(userDto,id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ResponseDto("201", LocalDateTime.now().toString(), "User Edited Sucessfully"));
    }

    @GetMapping("/fetch/{id}")
    public ResponseEntity<Optional<User>> fetchUser(@PathVariable Long id){

        Optional<User> foundUser = userService.fetchUser(id);

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .body(foundUser);
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<ResponseDto> deleteUser(@PathVariable Long id){

        userService.deleteUser(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ResponseDto("201", LocalDateTime.now().toString(), "User Deleted Sucessfully"));
    }
}
