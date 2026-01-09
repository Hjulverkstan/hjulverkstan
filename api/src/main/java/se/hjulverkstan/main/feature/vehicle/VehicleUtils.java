package se.hjulverkstan.main.feature.vehicle;

import se.hjulverkstan.main.error.exceptions.AlreadyUsedException;
import se.hjulverkstan.main.error.exceptions.MissingArgumentException;
import se.hjulverkstan.main.error.exceptions.UnsupportedVehicleStatusException;
import se.hjulverkstan.main.feature.vehicle.model.Vehicle;
import se.hjulverkstan.main.feature.vehicle.model.VehicleStatus;
import se.hjulverkstan.main.feature.vehicle.model.VehicleType;

import java.util.Optional;

public class VehicleUtils {
    public static void validateDtoBySelf (VehicleDto dto) {
        if (dto.isCustomerOwned()) {
            if (dto.getVehicleStatus() != null && dto.getVehicleStatus() != VehicleStatus.ARCHIVED) {
                throw new UnsupportedVehicleStatusException("A customer owned vehicle must only be ARCHIVED or null");
            }
        }

        if (dto.getVehicleType() != VehicleType.BATCH && !dto.isCustomerOwned()) {
            if (dto.getRegTag() == null) throw new MissingArgumentException("regTag");
        }

        if (dto.getVehicleType() == VehicleType.BATCH) {
            if (dto.getBatchCount() == null) throw new MissingArgumentException("batchCount");
        }

        if (dto.getVehicleType() == VehicleType.BIKE) {
            if (dto.getBikeType() == null) throw new MissingArgumentException("bikeType");
            if (dto.getGearCount() == null) throw new MissingArgumentException("gearCount");
            if (dto.getSize() == null) throw new MissingArgumentException("size");
            if (dto.getBrakeType() == null) throw new MissingArgumentException("brakeType");
            if (dto.getBrand() == null) throw new MissingArgumentException("brand");
        }
    }

    public static void validateCreateDtoByContext(VehicleDto dto, VehicleRepository vehicleRepository) {
        if (!dto.isCustomerOwned() && dto.getRegTag() != null) {
            Optional<Vehicle> match = vehicleRepository.findByRegTag(dto.getRegTag());
            if (match.isPresent() && match.get().getId() != dto.getId()) {
                throw new AlreadyUsedException("A vehicle with that regtag already exists");
            }
        }
    }

    public static void validateStatusByContext (VehicleStatusDto dto, Vehicle vehicle) {
        if (vehicle.isCustomerOwned()) {
            if (dto.getVehicleStatus() != null && dto.getVehicleStatus() != VehicleStatus.ARCHIVED) {
                throw new UnsupportedVehicleStatusException("A customer owned vehicle must only be ARCHIVED or null");
            }
        }

        vehicle.getTickets().forEach(ticket -> {
            if (ticket.isOpen()) {
                throw new UnsupportedVehicleStatusException("Vehicle status cannot be changed if in an active ticket.");
            }
        });
    }
}
