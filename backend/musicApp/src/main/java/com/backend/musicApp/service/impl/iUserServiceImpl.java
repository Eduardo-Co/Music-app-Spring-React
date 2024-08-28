package com.backend.musicApp.service.impl;

import com.backend.musicApp.dto.UserDto;
import com.backend.musicApp.entity.Role;
import com.backend.musicApp.entity.User;
import com.backend.musicApp.exception.ResourceAlreadyExistsException;
import com.backend.musicApp.exception.ResourceNotFoundException;
import com.backend.musicApp.mapper.UserMapper;
import com.backend.musicApp.repository.UserRepository;
import com.backend.musicApp.service.iUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class iUserServiceImpl implements iUserService {


    private final UserRepository userRepository;

    @Autowired
    public iUserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void createUser(UserDto userDto) {
        User user = UserMapper.toUser(userDto);

        Optional<User> foundUser = userRepository.findByEmail(user.getEmail());

        if(foundUser.isPresent())
            throw new ResourceAlreadyExistsException("User", "Email", userDto.getEmail());

        user.setRole(Role.User);

        userRepository.save(user);
    }

    @Override
    public void updateUser(UserDto userDto, Long id) {
        User updatedUser = UserMapper.toUser(userDto);
        Optional<User> foundUser = userRepository.findById(id);

        if (foundUser.isPresent()) {
            User existingUser = foundUser.get();

            existingUser.setUsername(updatedUser.getUsername());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setPassword(updatedUser.getPassword());
            existingUser.setRole(updatedUser.getRole());
            existingUser.setPhotoUrl(updatedUser.getPhotoUrl());

            Optional<User> verifyEmail = userRepository.findByEmail(existingUser.getEmail());

            if (verifyEmail.isPresent())
                throw new ResourceAlreadyExistsException("User", "Email", existingUser.getEmail());

            userRepository.save(existingUser);
        } else {
            throw new ResourceNotFoundException("User", "Email", updatedUser.getEmail());
        }
    }

    @Override
    public Optional<User> fetchUser(Long id) {
        Optional<User> foundUser = userRepository.findById(id);

        if (foundUser.isPresent()) {
            return foundUser;
        } else {
            throw new ResourceNotFoundException("User", "Id", id.toString());
        }
    }

    @Override
    public void deleteUser(Long id) {
        Optional<User> user = userRepository.findById(id);

        if(user.isPresent()) {
            userRepository.delete(user.get());
        }else{
            throw new ResourceNotFoundException("User", "Id", id.toString());
        }
    }
}
