package se.hjulverkstan.main.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.hjulverkstan.Exceptions.ElementNotFoundException;
import se.hjulverkstan.main.dto.EmployeeDto;
import se.hjulverkstan.main.dto.NewEmployeeDto;
import se.hjulverkstan.main.dto.responses.GetAllEmployeeDto;
import se.hjulverkstan.main.model.Employee;
import se.hjulverkstan.main.model.Workshop;
import se.hjulverkstan.main.repository.EmployeeRepository;
import se.hjulverkstan.main.repository.WorkshopRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EmployeeServiceImpl implements EmployeeService {
    private final WorkshopRepository workshopRepository;
    private final EmployeeRepository employeeRepository;
    public static final String ELEMENT_NAME = "Employee";

    @Autowired
    public EmployeeServiceImpl(EmployeeRepository employeeRepository, WorkshopRepository workshopRepository) {
        this.employeeRepository = employeeRepository;
        this.workshopRepository = workshopRepository;
    }

    @Override
    public GetAllEmployeeDto getAllEmployee() {
        List<Employee> employees = employeeRepository.findAll();
        List<EmployeeDto> responseList = new ArrayList<>();

        for (Employee employee : employees) {
            responseList.add(new EmployeeDto(employee));
        }
        return new GetAllEmployeeDto(responseList);
    }

    @Override
    public EmployeeDto getEmployeeById(Long id) {
        Optional<Employee> employeeOpt = employeeRepository.findById(id);
        if (employeeOpt.isEmpty()) {
            throw new ElementNotFoundException(ELEMENT_NAME);
        }
        return new EmployeeDto(employeeOpt.get());
    }

    @Override
    public EmployeeDto deleteEmployee(Long id) {
        Optional<Employee> employeeOpt = employeeRepository.findById(id);

        if (employeeOpt.isEmpty()) {
            throw new ElementNotFoundException(ELEMENT_NAME);
        }
        employeeRepository.delete(employeeOpt.get());
        return new EmployeeDto(employeeOpt.get());
    }

    @Override
    public EmployeeDto editEmployee(Long id, EmployeeDto employee) {
        Employee selectedEmployee = employeeRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException(ELEMENT_NAME));

        selectedEmployee.setName(employee.getName());
        selectedEmployee.setLastName(employee.getLastName());
        selectedEmployee.setEmail(employee.getEmail());
        selectedEmployee.setPhoneNumber(employee.getPhoneNumber());
        selectedEmployee.setUpdatedAt(LocalDateTime.now());
        selectedEmployee.setUpdatedBy(employee.getUpdatedBy());
        selectedEmployee.setComment(employee.getComment());

        // Update Employee in workshop
        updateEmployeeWorkshop(selectedEmployee, employee.getId());

        employeeRepository.save(selectedEmployee);

        return employee;
    }

    @Override
    public EmployeeDto createEmployee(NewEmployeeDto newEmployee) {
        Employee employee = new Employee();
        employee.setName(newEmployee.getName());
        employee.setLastName(newEmployee.getLastName());
        employee.setPhoneNumber(newEmployee.getPhoneNumber());
        employee.setEmail(newEmployee.getEmail());
        employee.setComment(newEmployee.getComment());

        Workshop workshop = workshopRepository.findById(newEmployee.getWorkshopId())
                .orElseThrow(() -> new ElementNotFoundException(ELEMENT_NAME));

        workshop.getEmployees().add(employee);
        employee.setWorkshop(workshop);

        employeeRepository.save(employee);

        return new EmployeeDto(employee);
    }

    private void updateEmployeeWorkshop(Employee selectedEmployee, Long newEmployeeId) {
        Workshop newWorkshop = workshopRepository.findById(newEmployeeId)
                .orElseThrow(() -> new ElementNotFoundException("New Workshop"));
        Workshop oldWorkshop = workshopRepository.findById(selectedEmployee.getWorkshop().getId())
                .orElseThrow(() -> new ElementNotFoundException("Old Workshop"));

        if (oldWorkshop.equals(newWorkshop)) {
            return; // No need to update if the old and new customers are the same.
        }

        oldWorkshop.getEmployees().remove(selectedEmployee);
        newWorkshop.getEmployees().add(selectedEmployee);
        selectedEmployee.setWorkshop(newWorkshop);
    }
}
