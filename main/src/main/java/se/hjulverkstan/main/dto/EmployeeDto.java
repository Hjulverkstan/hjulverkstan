package se.hjulverkstan.main.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.Employee;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeDto {
    private Long id;
    private String name;
    @JsonProperty("last_name")
    private String lastName;
    @JsonProperty("phone_number")
    private String phoneNumber;
    private String email;
    //TODO: remove comment when workshops added
    //private int workshopId;

    // Metadata
    @JsonProperty("updated_by")
    private Long updatedBy;
    private String comment;

    public EmployeeDto(Employee employee) {
        this(employee.getId(),
                employee.getName(),
                employee.getLastName(),
                employee.getPhoneNumber(),
                employee.getEmail(),
                employee.getUpdatedBy(),
                employee.getComment());
        // TODO: remove comment when workshops added
        // employee.getWorkshopId();
    }
}
