package se.hjulverkstan.main.feature.vehicle;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import se.hjulverkstan.main.feature.vehicle.model.Vehicle;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long>, JpaSpecificationExecutor<Vehicle> {
    Optional<Vehicle> findByRegTag(String regTag);

    List<Vehicle> findAllByDeletedFalse(Sort createdAt);

    List<Vehicle> findAllByDeletedFalse(Specification<Vehicle> vehicleSpecification, Sort createdAt);
}