package se.hjulverkstan.main.feature.vehicle;

import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.feature.vehicle.model.*;
import se.hjulverkstan.main.shared.auditable.AuditableFilterDto;
import se.hjulverkstan.main.shared.specs.IntRangeDto;

import java.util.List;

@Data
@NoArgsConstructor
public class VehicleFilterDto extends AuditableFilterDto {
    private List<VehicleType> vehicleType;
    private List<VehicleStatus> vehicleStatus;
    private List<Long> locationId;
    private List<Long> ticketIds;
    private List<Boolean> isCustomerOwned;
    private List<String> regTag;
    private IntRangeDto gearCount;
    private IntRangeDto batchCount;
    private List<BikeSize> size;
    private List<VehicleBrakeType> brakeType;
    private List<VehicleBrand> brand;
    private List<String> comment;
}