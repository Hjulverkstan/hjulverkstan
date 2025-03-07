package se.hjulverkstan.main.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.Employee;
import se.hjulverkstan.main.model.Ticket;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeDto {
    private Long id;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    private String phoneNumber;

    @Email(message = "Email must be valid")
    @NotBlank(message = "Email is required")
    private String email;

    @Pattern(
            regexp = "^\\d{8}-\\d{4}$",
            message = "Personal Identity Number must be in the format YYYYMMDD-XXXX"
    )
    private String personalIdentityNumber;

    private String comment;

    private List<Long> ticketIds;

    // Metadata
    private Long createdBy;
    private LocalDateTime createdAt;
    private Long updatedBy;
    private LocalDateTime updatedAt;

    public EmployeeDto(Employee employee) {
        this(employee.getId(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getPhoneNumber(),
                employee.getEmail(),
                employee.getPersonalIdentityNumber(),
                employee.getComment(),
                employee.getTickets()
                        .stream()
                        .map(Ticket::getId)
                        .collect(Collectors.toList()),
                employee.getCreatedBy(),
                employee.getCreatedAt(),
                employee.getUpdatedBy(),
                employee.getUpdatedAt());
    }
}
