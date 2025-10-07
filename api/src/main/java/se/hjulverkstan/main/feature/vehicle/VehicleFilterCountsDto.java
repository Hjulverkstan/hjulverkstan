package se.hjulverkstan.main.feature.vehicle;

import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.feature.vehicle.model.*;
import se.hjulverkstan.main.shared.FilterUtils;
import se.hjulverkstan.main.shared.ValueCountDto;
import se.hjulverkstan.main.shared.auditable.AuditableFilterCountsDto;
import se.hjulverkstan.main.shared.auditable.AuditableFilterDto;
import se.hjulverkstan.main.shared.specs.IntRangeDto;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
public class VehicleFilterCountsDto extends AuditableFilterCountsDto {
    private List<ValueCountDto<VehicleType>> vehicleType;
    private List<ValueCountDto<VehicleStatus>> vehicleStatus;
    private List<ValueCountDto<Long>> locationId;
    private List<ValueCountDto<Long>> ticketIds;
    private List<ValueCountDto<Boolean>> isCustomerOwned;
    private List<ValueCountDto<String>> regTag;
    private IntRangeDto gearCount;
    private IntRangeDto batchCount;
    private List<ValueCountDto<BikeSize>> size;
    private List<ValueCountDto<VehicleBrakeType>> brakeType;
    private List<ValueCountDto<VehicleBrand>> brand;
    private List<ValueCountDto<String>> comment;

    public VehicleFilterCountsDto(List<VehicleDto> vehicles) {
        super(vehicles);

        vehicleType = FilterUtils.countsList(vehicles, VehicleDto::getVehicleType);
        vehicleStatus = FilterUtils.countsList(vehicles, VehicleDto::getVehicleStatus);
        locationId = FilterUtils.countsList(vehicles, VehicleDto::getLocationId);
        ticketIds = FilterUtils.flattenedCountsList(vehicles, VehicleDto::getTicketIds);
        isCustomerOwned = FilterUtils.countsList(vehicles, VehicleDto::isCustomerOwned);
        regTag = FilterUtils.countsList(vehicles, VehicleDto::getRegTag);

        gearCount = FilterUtils.intRange(vehicles, VehicleDto::getGearCount);
        batchCount = FilterUtils.intRange(vehicles, VehicleDto::getBatchCount);

        size = FilterUtils.countsList(vehicles, VehicleDto::getSize);
        brakeType = FilterUtils.countsList(vehicles, VehicleDto::getBrakeType);
        brand = FilterUtils.countsList(vehicles, VehicleDto::getBrand);
        comment = FilterUtils.countsList(vehicles, VehicleDto::getComment);
    }
}