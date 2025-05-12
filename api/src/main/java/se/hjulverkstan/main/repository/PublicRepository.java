package se.hjulverkstan.main.repository;
import se.hjulverkstan.main.model.Vehicle;

import java.util.List;
import java.util.Optional;

public interface PublicRepository {
    List<Vehicle> findPublicAvailableVehicles(Long locationId);
    Optional<Vehicle> findById(Long id);
}