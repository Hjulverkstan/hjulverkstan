package se.hjulverkstan.main.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewWorkshopDto {
    private String address;
    @JsonProperty("phone_number")
    private String phoneNumber;
    private Long latitude;
    private Long longitude;
    private String comment;

    // Metadata
    @JsonProperty("updated_by")
    private Long updatedBy;
}
