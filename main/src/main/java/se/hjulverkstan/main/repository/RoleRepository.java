package se.hjulverkstan.main.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import se.hjulverkstan.main.model.user.ERole;
import se.hjulverkstan.main.model.user.Role;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
}