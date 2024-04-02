package se.hjulverkstan.main.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.hjulverkstan.Exceptions.ElementNotFoundException;
import se.hjulverkstan.main.dto.EmployeeDto;
import se.hjulverkstan.main.dto.NewEmployeeDto;
import se.hjulverkstan.main.dto.responses.GetAllEmployeeDto;
import se.hjulverkstan.main.model.Employee;
import se.hjulverkstan.main.model.Ticket;
import se.hjulverkstan.main.model.Workshop;
import se.hjulverkstan.main.repository.EmployeeRepository;
import se.hjulverkstan.main.repository.WorkshopRepository;

import java.util.ArrayList;
import java.util.List;

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
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException(ELEMENT_NAME));

        return new EmployeeDto(employee);
    }

    @Override
    public EmployeeDto deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException(ELEMENT_NAME));

        if (employee.getWorkshop() != null) {
            Workshop workshop = employee.getWorkshop();
            workshop.getEmployees().remove(employee);
        }

        if (employee.getTickets() != null) {
            List<Ticket> tickets = employee.getTickets();
            //TODO: how to handle removing employee here?
            tickets.forEach(ticket -> ticket.setEmployee(null));
        }

        employeeRepository.delete(employee);
        return new EmployeeDto(employee);
    }

    @Override
    public EmployeeDto editEmployee(Long id, EmployeeDto employee) {
        Employee selectedEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(ELEMENT_NAME));

        selectedEmployee.setEmployeeNumber(employee.getEmployeeNumber());
        selectedEmployee.setName(employee.getName());
        selectedEmployee.setLastName(employee.getLastName());
        selectedEmployee.setPhoneNumber(employee.getPhoneNumber());
        selectedEmployee.setEmail(employee.getEmail());
        selectedEmployee.setPersonalIdentityNumber(employee.getPersonalIdentityNumber());
        selectedEmployee.setComment(employee.getComment());


        Workshop newWorkshop = getEmployeeWorkshop(employee.getWorkshopId());
        Workshop oldWorkshop = selectedEmployee.getWorkshop();
        if (!oldWorkshop.equals(newWorkshop)) {
            oldWorkshop.getEmployees().remove(selectedEmployee);
            newWorkshop.getEmployees().add(selectedEmployee);
            selectedEmployee.setWorkshop(newWorkshop);
        }

        employeeRepository.save(selectedEmployee);
        return new EmployeeDto(selectedEmployee);
    }

    @Override
    public EmployeeDto createEmployee(NewEmployeeDto newEmployee) {
        Employee employee = new Employee();
        employee.setEmployeeNumber(newEmployee.getEmployeeNumber());
        employee.setName(newEmployee.getName());
        employee.setLastName(newEmployee.getLastName());
        employee.setPhoneNumber(newEmployee.getPhoneNumber());
        employee.setEmail(newEmployee.getEmail());
        employee.setPersonalIdentityNumber(newEmployee.getPersonalIdentityNumber());
        employee.setComment(newEmployee.getComment());
        employee.setTickets(new ArrayList<>());

        Workshop workshop = getEmployeeWorkshop(newEmployee.getWorkshopId());
        workshop.getEmployees().add(employee);
        employee.setWorkshop(workshop);

        employeeRepository.save(employee);
        return new EmployeeDto(employee);
    }

    private Workshop getEmployeeWorkshop(Long workshopId) {
        return workshopRepository.findById(workshopId)
                .orElseThrow(() -> new ElementNotFoundException("Workshop with id: " + workshopId));
    }
}
