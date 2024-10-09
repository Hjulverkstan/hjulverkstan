package se.hjulverkstan.main.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import se.hjulverkstan.main.model.ticket.Ticket;
@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
}
