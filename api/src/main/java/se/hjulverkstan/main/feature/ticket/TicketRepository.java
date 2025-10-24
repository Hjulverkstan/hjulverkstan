package se.hjulverkstan.main.feature.ticket;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import se.hjulverkstan.main.feature.vehicle.model.Vehicle;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByVehicles(List<Vehicle> vehicles);
}
