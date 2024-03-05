package se.hjulverkstan.main.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.Workshop;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkshopDto {
    private Long id;
    private String address;
    @JsonProperty("phone_number")
    private String phoneNumber;
    private Long latitude;
    private Long longitude;
    @JsonProperty("employee_ids")
    private List<Long> employeeIds;
    private String comment;

    // Metadata
    @JsonProperty("created_by")
    private Long createdBy;
    @JsonProperty("created_at")
    private LocalDateTime createdAt;
    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;
    @JsonProperty("updated_by")
    private Long updatedBy;

    public WorkshopDto(Workshop workshop) {
        this(workshop.getId(),
                workshop.getAddress(),
                workshop.getPhoneNumber(),
                workshop.getLatitude(),
                workshop.getLongitude(),
                workshop.getEmployees()
                        .stream()
                        .map(employee -> employee.getId())
                        .collect(Collectors.toList()),
                workshop.getComment(),
                workshop.getCreatedBy(),
                workshop.getCreatedAt(),
                workshop.getUpdatedAt(),
                workshop.getUpdatedBy());
    }
}
