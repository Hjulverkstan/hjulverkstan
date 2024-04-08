package se.hjulverkstan.main.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.Location;
import se.hjulverkstan.main.model.LocationType;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LocationDto {
    private Long id;
    @NotBlank(message = "Address is required")
    private String address;
    @NotBlank(message = "Name is required")
    private String name;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @NotNull(message = "LocationType is required")
    private LocationType locationType;
    private String comment;

    // Metadata
    private Long createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long updatedBy;

    public LocationDto(Location location) {
        this(location.getId(),
                location.getAddress(),
                location.getName(),
                location.getLocationType(),
                location.getComment(),
                location.getCreatedBy(),
                location.getCreatedAt(),
                location.getUpdatedAt(),
                location.getUpdatedBy());
    }
}