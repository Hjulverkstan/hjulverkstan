package se.hjulverkstan.main.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.Employee;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeDto {
    private Long id;
    private String name;
    private String lastName;
    private String phoneNumber;
    private String email;
    private Long workshopId;
    private String comment;

    // Metadata
    private Long createdBy;
    private LocalDateTime createdAt;
    private Long updatedBy;
    private LocalDateTime updatedAt;

    public EmployeeDto(Employee employee) {
        this(employee.getId(),
                employee.getName(),
                employee.getLastName(),
                employee.getPhoneNumber(),
                employee.getEmail(),
                employee.getWorkshop().getId(),
                employee.getComment(),
                employee.getCreatedBy(),
                employee.getCreatedAt(),
                employee.getUpdatedBy(),
                employee.getUpdatedAt());
    }
}
