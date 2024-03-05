package se.hjulverkstan.main.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonProperty("last_name")
    private String lastName;
    @JsonProperty("phone_number")
    private String phoneNumber;
    private String email;
    @JsonProperty("workshop_id")
    private Long workshopId;
    private String comment;

    // Metadata
    @JsonProperty("created_by")
    private Long createdBy;
    @JsonProperty("created_at")
    private LocalDateTime createdAt;
    @JsonProperty("updated_by")
    private Long updatedBy;
    @JsonProperty("updated_at")
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
