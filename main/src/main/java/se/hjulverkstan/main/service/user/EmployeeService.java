package se.hjulverkstan.main.service.user;

import se.hjulverkstan.main.dto.user.EmployeeDto;
import se.hjulverkstan.main.dto.user.NewEmployeeDto;
import se.hjulverkstan.main.dto.responses.GetAllEmployeeDto;

public interface EmployeeService {
    public GetAllEmployeeDto getAllEmployee();

    public EmployeeDto getEmployeeById(Long id);

    public EmployeeDto deleteEmployee(Long id);

    public EmployeeDto editEmployee(Long id, EmployeeDto employee);

    public EmployeeDto createEmployee(NewEmployeeDto newEmployee);
}
