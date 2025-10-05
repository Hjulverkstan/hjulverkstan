package se.hjulverkstan.main.security.repository;


import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import se.hjulverkstan.main.security.model.ERole;
import se.hjulverkstan.main.security.model.Role;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);

    List<Role> findAllByNameIn(@NotNull List<ERole> roles);
}