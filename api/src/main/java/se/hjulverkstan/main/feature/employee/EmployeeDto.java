package se.hjulverkstan.main.feature.employee;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.feature.ticket.Ticket;
import se.hjulverkstan.main.shared.auditable.AuditableDto;

import java.util.ArrayList;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class EmployeeDto extends AuditableDto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @JsonSerialize(using = ToStringSerializer.class)
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

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @JsonSerialize(contentUsing = ToStringSerializer.class)
    private List<Long> ticketIds = new ArrayList<>();

    private String comment;

    public EmployeeDto(Employee employee) {
        super(employee);

        id = employee.getId();
        firstName = employee.getFirstName();
        lastName = employee.getLastName();
        phoneNumber = employee.getPhoneNumber();
        email = employee.getEmail();
        personalIdentityNumber = employee.getPersonalIdentityNumber();
        ticketIds = employee.getTickets().stream().map(Ticket::getId).toList();
        comment = employee.getComment();
    }

    public Employee applyToEntity (Employee employee) {
        employee.setFirstName(firstName);
        employee.setLastName(lastName);
        employee.setPhoneNumber(phoneNumber);
        employee.setEmail(email);
        employee.setPersonalIdentityNumber(personalIdentityNumber);
        employee.setComment(comment);

        return employee;
    }
}
