package se.hjulverkstan.main.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.Workshop;

import java.time.LocalDateTime;

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
    private String comment;

    // Metadata
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
                workshop.getComment(),
                workshop.getUpdatedAt(),
                workshop.getUpdatedBy());
    }
}
