package se.hjulverkstan.main.feature.location;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.feature.vehicle.model.Vehicle;
import se.hjulverkstan.main.shared.auditable.AuditableDto;

import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LocationDto extends AuditableDto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Name is required")
    private String name;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @NotNull(message = "LocationType is required")
    private LocationType locationType;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @JsonSerialize(contentUsing = ToStringSerializer.class)
    private List<Long> vehicleIds = new ArrayList<>();
    private String comment;

    public LocationDto(Location location) {
        super(location);
        this.id = location.getId();
        this.address = location.getAddress();
        this.name = location.getName();
        this.locationType = location.getLocationType();
        this.vehicleIds = location.getVehicles().stream().map(Vehicle::getId).toList();
        this.comment = location.getComment();
    }

    public Location applyToEntity (Location location) {
        location.setAddress(address);
        location.setName(name);
        location.setLocationType(locationType);
        location.setComment(comment);

        return location;
    }
}