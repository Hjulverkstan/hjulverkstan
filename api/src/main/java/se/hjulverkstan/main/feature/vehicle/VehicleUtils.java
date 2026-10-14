package se.hjulverkstan.main.feature.vehicle;

import se.hjulverkstan.main.error.exceptions.AlreadyUsedException;
import se.hjulverkstan.main.error.exceptions.UnsupportedVehicleLocationException;
import se.hjulverkstan.main.error.exceptions.UnsupportedVehicleStatusException;
import se.hjulverkstan.main.feature.ticket.Ticket;
import se.hjulverkstan.main.feature.vehicle.model.Vehicle;
import se.hjulverkstan.main.feature.vehicle.model.VehicleStatus;
import se.hjulverkstan.main.feature.vehicle.model.VehicleType;
import se.hjulverkstan.main.shared.ValidationUtils;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

public class VehicleUtils {
    public static void validateDtoBySelf (VehicleDto dto) {
        if (dto.isCustomerOwned()) {
            if (dto.getVehicleStatus() != null && dto.getVehicleStatus() != VehicleStatus.ARCHIVED) {
                throw new UnsupportedVehicleStatusException("A customer owned vehicle must only be ARCHIVED or null");
            }
        }

        if (dto.getVehicleType() != VehicleType.BATCH && !dto.isCustomerOwned()) {
            ValidationUtils.validateNotNull(dto.getRegTag(), "regTag");
        }

        if (dto.getVehicleType() == VehicleType.BATCH) {
            ValidationUtils.validateNotNull(dto.getBatchCount(), "batchCount");
        }

        if (dto.getVehicleType() == VehicleType.BIKE && !dto.isCustomerOwned()) {
            ValidationUtils.validateNotNull(dto.getBikeType(), "bikeType");
            ValidationUtils.validateNotNull(dto.getGearCount(), "gearCount");
            ValidationUtils.validateNotNull(dto.getSize(), "size");
            ValidationUtils.validateNotNull(dto.getBrakeType(), "brakeType");
            ValidationUtils.validateNotNull(dto.getBrand(), "brand");
        }
    }

    public static void validateDtoByContext (VehicleDto dto, List<Ticket> tickets) {
        if (tickets != null) {
            List<Ticket> openTickets = tickets.stream().filter(Ticket::isOpen).toList();
            if (openTickets.stream().anyMatch(t -> !Objects.equals(t.getLocation().getId(), dto.getLocationId()))) {
                throw new UnsupportedVehicleLocationException("Invalid location, please close any tickets of the current location before relocating the vehicle");
            }
        }
    }

    public static void validateCreateDtoByContext (VehicleDto dto, VehicleRepository vehicleRepository) {
        if (!dto.isCustomerOwned() && dto.getRegTag() != null) {
            Optional<Vehicle> match = vehicleRepository.findByRegTag(dto.getRegTag());
            if (match.isPresent() && !Objects.equals(match.get().getId(), dto.getId())) {
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
