package se.hjulverkstan.main.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import se.hjulverkstan.main.model.Vehicle;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Optional<Vehicle> findByRegTag(String regTag);

    // This method is used to find multiple vehicles by their registration tag.
    // There is conflict of intention with the entity design
    List<Vehicle> findMultipleByRegTag(String regTag);
}