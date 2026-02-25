package se.hjulverkstan.main.feature.webedit.release;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface IdentityRepository extends JpaRepository<Identity, UUID> {
}