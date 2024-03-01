package se.hjulverkstan.main.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.hjulverkstan.main.model.Workshop;

public interface WorkshopRepository extends JpaRepository<Workshop, Long> {
}
