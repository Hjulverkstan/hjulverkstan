package se.hjulverkstan.main.feature.customer;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository <Customer, Long> {
    List<Customer> findAllByDeletedFalse(Sort createdAt);

    Optional<Customer> findByEmail(String email);
    Optional<Customer> findByPersonalIdentityNumber(String personalIdentityNumber);
}
