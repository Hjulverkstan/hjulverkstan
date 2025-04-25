package se.hjulverkstan.main.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import se.hjulverkstan.main.model.Customer;

@Repository
public interface CustomerRepository extends JpaRepository <Customer, Long> {
}
