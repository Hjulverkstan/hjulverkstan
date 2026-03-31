package se.hjulverkstan.main.feature.employee;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.error.exceptions.InvalidDataException;
import se.hjulverkstan.main.shared.ListResponseDto;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public ListResponseDto<EmployeeDto> getAllEmployees() {
        List<Employee> employees = employeeRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return new ListResponseDto<>(employees.stream().map(EmployeeDto::new).toList());
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

        if (employee.isAnonymized()) {
            throw new InvalidDataException("Cannot edit an anonymized employee");
        }

        dto.applyToEntity(employee);
        employeeRepository.save(employee);

        return new EmployeeDto(employee);
    }

    @Transactional
    public EmployeeDto deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Employee"));

        boolean hasTickets = employee.getTickets() != null && !employee.getTickets().isEmpty();

        if (hasTickets && !employee.isAnonymized()) {
            return anonymizeEmployee(employee);
        }

        if (hasTickets) {
            throw new InvalidDataException("Cannot delete an anonymized employee that still has tickets");
        }

        EmployeeDto dto = new EmployeeDto(employee);
        employeeRepository.delete(employee);
        return dto;
    }

    private EmployeeDto anonymizeEmployee(Employee employee) {
        if (employee.isAnonymized()) {
            throw new InvalidDataException("Employee is already anonymized");
        }

        employee.setFirstName("Removed");
        employee.setLastName("Employee");
        employee.setPhoneNumber(null);
        employee.setEmail(null);
        employee.setPersonalIdentityNumber(null);
        employee.setComment(null);
        employee.setAnonymized(true);

        employeeRepository.save(employee);
        return new EmployeeDto(employee);
    }
}
