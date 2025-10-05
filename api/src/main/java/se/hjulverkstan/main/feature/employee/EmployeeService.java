package se.hjulverkstan.main.feature.employee;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.error.exceptions.CouldNotDeleteException;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public GetAllEmployeeDto getAllEmployees() {
        List<Employee> employees = employeeRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return new GetAllEmployeeDto(employees);
    }

    public EmployeeDto getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Employee"));
        return new EmployeeDto(employee);
    }

    @Transactional
    public EmployeeDto createEmployee(EmployeeDto dto) {
        Employee employee = dto.applyToEntity(new Employee());

        employeeRepository.save(employee);
        return new EmployeeDto(employee);
    }

    @Transactional
    public EmployeeDto editEmployee(Long id, EmployeeDto dto) {
        Employee employee = employeeRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Employee"));

        dto.applyToEntity(employee);
        employeeRepository.save(employee);

        return new EmployeeDto(employee);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Employee"));

        if (employee.getTickets() != null && !employee.getTickets().isEmpty()) {
            throw new CouldNotDeleteException("Can't delete employees with tickets!");
        }

        employeeRepository.delete(employee);
    }
}