package se.hjulverkstan.main.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import se.hjulverkstan.main.model.Bike;

@Repository
public interface BikeRepository extends JpaRepository<Bike, Long> {
}
