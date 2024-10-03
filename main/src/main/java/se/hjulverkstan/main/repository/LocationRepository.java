package se.hjulverkstan.main.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.hjulverkstan.main.model.location.Location;

public interface LocationRepository extends JpaRepository<Location, Long> {
}