package se.hjulverkstan.main.dto.vehicles;

import com.fasterxml.jackson.annotation.JsonFormat;
<<<<<<< HEAD
import jakarta.validation.constraints.NotNull;
=======
>>>>>>> 20190df (feat(api): New vehicle sublcasses + vehicle & workshop validation)
import lombok.*;
import se.hjulverkstan.main.model.StrollerType;
import se.hjulverkstan.main.model.VehicleStroller;

@Setter
@Getter
@ToString
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class VehicleStrollerDto extends VehicleDto {
    @NotNull(message = "The field 'isFoldable' should not be null")
    private Boolean isFoldable;
    @NotNull(message = "The field 'hasStorageBasket' should not be null")
    private Boolean hasStorageBasket;
    @NotNull(message = "Stroller type is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private StrollerType strollerType;

    public VehicleStrollerDto(VehicleStroller vehicleStroller) {
        super(vehicleStroller);
        this.isFoldable = vehicleStroller.isFoldable();
        this.hasStorageBasket = vehicleStroller.isHasStorageBasket();
        this.strollerType = vehicleStroller.getStrollerType();

    }
}
