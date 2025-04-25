package se.hjulverkstan.main.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.LocationType;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewLocationDto {
    @NotBlank(message = "Address is required")
    private String address;
    private String comment;
    @NotBlank(message = "Name is required")
    private String name;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @NotNull(message = "LocationType is required")
    private LocationType locationType;
}