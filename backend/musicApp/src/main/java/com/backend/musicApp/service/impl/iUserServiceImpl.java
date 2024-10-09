package com.backend.musicApp.service.impl;

import com.backend.musicApp.dto.UserDto;
import com.backend.musicApp.entity.Roles;
import com.backend.musicApp.entity.User;
import com.backend.musicApp.exception.ResourceAlreadyExistsException;
import com.backend.musicApp.mapper.UserMapper;
import com.backend.musicApp.repository.RolesRepository;
import com.backend.musicApp.repository.UserRepository;
import com.backend.musicApp.service.iUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
public class iUserServiceImpl implements iUserService {

    private final UserRepository userRepository;
    private final RolesRepository roleRepository;

    @Autowired
    public iUserServiceImpl(UserRepository userRepository, RolesRepository roleR) {
        this.userRepository = userRepository;
        this.roleRepository = roleR;
    }

    @Override
    public void createUser(UserDto user) {
        if(userRepository.findByEmail(user.getEmail()) != null){
            throw new ResourceAlreadyExistsException("user", "email", user.getEmail());
        }
        String encryptedPassword = new BCryptPasswordEncoder().encode(user.getPassword());
        user.setPassword(encryptedPassword);
        User newUser = UserMapper.toUser(user);
        Roles userRole = roleRepository.findByRoleName(Roles.RoleName.USER)
                .orElseThrow(() -> new RuntimeException("Role USER not found."));

        newUser.setRoles(Set.of(userRole));

        userRepository.save(newUser);
    }

    @Override
    public void updateUser(UserDto user, Long id) {

    }

    @Override
    public Optional<User> fetchUser(Long id) {
        return Optional.empty();
    }

    @Override
    public void deleteUser(Long id) {

    }

    @Override
    public void printSomething() {

    }
}