package se.hjulverkstan.main.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.hjulverkstan.main.model.Location;

public interface LocationRepository extends JpaRepository<Location, Long> {
}