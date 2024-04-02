package se.hjulverkstan.main.dto.vehicles;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import se.hjulverkstan.main.model.StrollerType;
import se.hjulverkstan.main.model.VehicleStroller;

@Setter
@Getter
@ToString
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class NewVehicleStrollerDto extends NewVehicleDto {
    @NotNull(message = "The field 'isFoldable' should not be null")
    private Boolean isFoldable;
    @NotNull(message = "The field 'hasStorageBasket' should not be null")
    private Boolean hasStorageBasket;
    @NotNull(message = "Stroller type is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private StrollerType strollerType;

    //This constructor may or may not be needed. If not, remove!
    public NewVehicleStrollerDto(VehicleStroller vehicleStroller) {
        super(vehicleStroller);
        this.isFoldable = vehicleStroller.isFoldable();
        this.hasStorageBasket = vehicleStroller.isHasStorageBasket();
        this.strollerType = vehicleStroller.getStrollerType();
    }
}