package se.hjulverkstan.main.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.dto.user.EmployeeDto;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAllEmployeeDto {
    private List<EmployeeDto> employees;
}
