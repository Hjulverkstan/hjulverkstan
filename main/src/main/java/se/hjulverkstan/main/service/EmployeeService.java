package se.hjulverkstan.main.service;

import se.hjulverkstan.main.dto.EmployeeDto;
import se.hjulverkstan.main.dto.NewEmployeeDto;
import se.hjulverkstan.main.dto.responses.GetAllEmployeeDto;

public interface EmployeeService {
    public GetAllEmployeeDto getAllEmployee();

    public EmployeeDto getEmployeeById(Long id);

    public EmployeeDto deleteEmployee(Long id);

    public EmployeeDto editEmployee(Long id, EmployeeDto employee);

    public EmployeeDto createEmployee(NewEmployeeDto newEmployee);
}
