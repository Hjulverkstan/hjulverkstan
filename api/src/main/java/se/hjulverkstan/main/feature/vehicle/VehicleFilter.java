package se.hjulverkstan.main.feature.vehicle;

import org.springframework.data.jpa.domain.Specification;
import se.hjulverkstan.main.feature.location.Location_;
import se.hjulverkstan.main.feature.ticket.Ticket_;
import se.hjulverkstan.main.feature.vehicle.model.Vehicle;
import se.hjulverkstan.main.feature.vehicle.model.Vehicle_;
import se.hjulverkstan.main.shared.auditable.AuditableFilter;
import se.hjulverkstan.main.shared.specs.Specs;

public class VehicleFilter {
    public static Specification<Vehicle> create(VehicleFilterDto dto) {
        if (dto == null) dto = new VehicleFilterDto();

        return Specs.allOf(
                Specs.enumIn(dto.getVehicleType(), r -> r.get(Vehicle_.vehicleType)),
                Specs.enumIn(dto.getVehicleStatus(), r -> r.get(Vehicle_.vehicleStatus)),
                Specs.in(dto.getLocationId(), r -> r.get(Vehicle_.location).get(Location_.id)),
                Specs.inManyToMany(dto.getTicketIds(), r -> r.join(Vehicle_.tickets).get(Ticket_.id)),
                Specs.in(dto.getIsCustomerOwned(), r -> r.get(Vehicle_.isCustomerOwned)),
                Specs.containsAny(dto.getRegTag(), r -> r.get(Vehicle_.regTag)),
                Specs.intRange(dto.getGearCount(), r -> r.get(Vehicle_.gearCount)),
                Specs.intRange(dto.getBatchCount(), r -> r.get(Vehicle_.batchCount)),
                Specs.enumIn(dto.getSize(), r -> r.get(Vehicle_.size)),
                Specs.enumIn(dto.getBrakeType(), r -> r.get(Vehicle_.brakeType)),
                Specs.enumIn(dto.getBrand(), r -> r.get(Vehicle_.brand)),
                Specs.containsAny(dto.getComment(), r -> r.get(Vehicle_.comment)),
                AuditableFilter.create(dto)
        );
    }
}