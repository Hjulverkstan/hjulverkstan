package se.hjulverkstan.main.feature.employee;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class GetAllEmployeeDto {
    private List<EmployeeDto> employees;

    public GetAllEmployeeDto (List<Employee> employees) {
        this.employees = employees.stream().map(EmployeeDto::new).toList();
    }
}
