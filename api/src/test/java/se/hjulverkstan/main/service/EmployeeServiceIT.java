package se.hjulverkstan.main.service;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import se.hjulverkstan.main.annotations.RepositoryTest;
import se.hjulverkstan.main.dto.EmployeeDto;
import se.hjulverkstan.main.dto.responses.GetAllEmployeeDto;
import se.hjulverkstan.main.util.AbstractSchemaIsolatedTest;

import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@RepositoryTest
public class EmployeeServiceIT {

    @Autowired
    private EmployeeService employeeService;

    @Test
    void getAllEmployee() {
        GetAllEmployeeDto getAllEmployeeDto = employeeService.getAllEmployee();
        assertThat(getAllEmployeeDto).isNotNull();

        List<EmployeeDto> employeeDtos = getAllEmployeeDto.getEmployees();
        assertThat(employeeDtos).isNotNull();
    }

}
