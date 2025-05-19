package se.hjulverkstan.main.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.model.TicketStatus;
import se.hjulverkstan.main.model.TicketType;
import se.hjulverkstan.main.model.Vehicle;
import se.hjulverkstan.main.model.VehicleStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional

public class PublicRepositoryImpl implements PublicRepository {
    @PersistenceContext
    private EntityManager entityManager;

    @Value("${rentalTimeMarginInDays}")
    private int rentalTimeMarginInDays;

    private List<Vehicle> findPublicAvailableVehiclesWithinMargin(Long vehicleId, Long locationId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime margin = now.plusDays(rentalTimeMarginInDays);

        String baseQuery = """
            SELECT v FROM Vehicle v
            WHERE v.isCustomerOwned = false
              AND v.vehicleStatus = :status
              AND NOT EXISTS (
                  SELECT t FROM Ticket t
                  JOIN t.vehicles tv
                  WHERE tv = v
                    AND t.ticketType = :rentType
                    AND t.ticketStatus != :closed
                    AND t.startDate BETWEEN :now AND :margin
              )
        """;

        if (vehicleId != null) {
            baseQuery += " AND v.id = :vehicleId";
        }
        if (locationId != null) {
            baseQuery += " AND v.location.id = :locationId";
        }

        var query = entityManager.createQuery(baseQuery, Vehicle.class)
                .setParameter("status", VehicleStatus.AVAILABLE)
                .setParameter("rentType", TicketType.RENT)
                .setParameter("closed", TicketStatus.CLOSED)
                .setParameter("now", now)
                .setParameter("margin", margin);

        if (vehicleId != null) {
            query.setParameter("vehicleId", vehicleId);
        }
        if (locationId != null) {
            query.setParameter("locationId", locationId);
        }

        return query.getResultList();
    }
     @Override
     public List<Vehicle> findPublicAvailableVehicles(Long locationId) {
         return findPublicAvailableVehiclesWithinMargin(null, locationId);
     }

    @Override
    public Optional<Vehicle> findById(Long id) {
        return findPublicAvailableVehiclesWithinMargin(id, null).stream().findFirst();
    }
}
