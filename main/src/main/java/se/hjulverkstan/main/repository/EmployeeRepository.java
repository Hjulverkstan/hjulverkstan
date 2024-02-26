package se.hjulverkstan.main.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import se.hjulverkstan.main.model.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}
