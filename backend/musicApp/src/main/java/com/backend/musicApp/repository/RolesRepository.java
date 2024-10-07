package com.backend.musicApp.repository;

import com.backend.musicApp.entity.Roles;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RolesRepository extends JpaRepository<Roles, Long> {
    Optional<Roles> findByRoleName(Roles.RoleName roleName);
}
