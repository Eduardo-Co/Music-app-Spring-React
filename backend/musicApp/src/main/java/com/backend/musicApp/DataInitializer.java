package com.backend.musicApp;

import com.backend.musicApp.entity.Roles;
import com.backend.musicApp.entity.User;
import com.backend.musicApp.repository.RolesRepository;
import com.backend.musicApp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initRolesAndAdminUser(RolesRepository rolesRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (rolesRepository.count() == 0) {
                Roles adminRole = new Roles();
                adminRole.setRoleName(Roles.RoleName.ADMIN);
                rolesRepository.save(adminRole);

                Roles userRole = new Roles();
                userRole.setRoleName(Roles.RoleName.USER);
                rolesRepository.save(userRole);

                System.out.println("Admin and User roles inserted.");
            }

            if (userRepository.count() == 0) {
                User adminUser = new User();
                adminUser.setUsername("admin");
                adminUser.setEmail("admin@example.com");
                adminUser.setPassword(passwordEncoder.encode("password"));
                Optional<Roles> adminRoleOptional = rolesRepository.findByRoleName(Roles.RoleName.ADMIN);
                adminRoleOptional.ifPresent(roles -> adminUser.setRoles(Set.of(roles)));

                userRepository.save(adminUser);
            }

        };
    }
}
