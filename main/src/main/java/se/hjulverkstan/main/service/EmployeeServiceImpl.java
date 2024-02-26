package se.hjulverkstan.main.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.hjulverkstan.Exceptions.ElementNotFoundException;
import se.hjulverkstan.main.dto.EmployeeDto;
import se.hjulverkstan.main.dto.NewEmployeeDto;
import se.hjulverkstan.main.dto.responses.GetAllEmployeeDto;
import se.hjulverkstan.main.model.Employee;
import se.hjulverkstan.main.repository.EmployeeRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EmployeeServiceImpl implements EmployeeService {
    // TODO: remove comment when workshops added
    // private WorkshopRepository workshopRepository;
    private final EmployeeRepository employeeRepository;
    public static final String ELEMENT_NAME = "Employee";

    @Autowired
    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
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
        Optional<Employee> employeeOpt = employeeRepository.findById(id);
        if (employeeOpt.isEmpty()) {
            throw new ElementNotFoundException(ELEMENT_NAME);
        }

        Employee selectedEmployee = employeeOpt.get();

        selectedEmployee.setName(employee.getName());
        selectedEmployee.setLastName(employee.getLastName());
        selectedEmployee.setEmail(employee.getEmail());
        selectedEmployee.setPhoneNumber(employee.getPhoneNumber());
        selectedEmployee.setUpdatedAt(LocalDateTime.now());
        selectedEmployee.setUpdatedBy(employee.getUpdatedBy());
        selectedEmployee.setComment(employee.getComment());

        // TODO: remove comment when workshops added
        /*Optional<Workshop> workshopOpt = workshopRepository.findById(employee.getWorkshopId());
        if (workshopOpt.isEmpty()) {
            throw new ElementNotFoundException(ELEMENT_NAME);
        }
        workshopOpt.getEmployees().add(employee);
        workshopRepository.save(workshopOpt.get());

        selectedEmployee.setWorkshop(workshopOpt.get());*/
        employeeRepository.save(selectedEmployee);
        return employee;
    }

    @Override
    public EmployeeDto createEmployee(NewEmployeeDto newEmployee) {
        Employee employee = new Employee();
        employee.setName(newEmployee.getName());
        employee.setLastName(newEmployee.getLastName());
        employee.setEmail(newEmployee.getEmail());
        employee.setPhoneNumber(newEmployee.getPhoneNumber());
        employee.setCreatedAt(LocalDateTime.now());
        employee.setUpdatedAt(LocalDateTime.now());
        employee.setUpdatedBy(newEmployee.getUpdatedBy());
        employee.setComment(newEmployee.getComment());

        // TODO: remove comment when workshops added
        /* Optional<Workshop> workshopOpt = workshopRepository.findById(newEmployee.getWorkshopId());
        if(workshopOpt.isEmpty()) {
            throw new ElementNotFoundException(ELEMENT_NAME);
        }
        workshopOpt.getEmployees().add(employee);
        workshopRepository.save(workshopOpt.get());

        employee.setWorkshop(workshopOpt.get());*/
        employeeRepository.save(employee);
        return new EmployeeDto(employee);
    }
}
