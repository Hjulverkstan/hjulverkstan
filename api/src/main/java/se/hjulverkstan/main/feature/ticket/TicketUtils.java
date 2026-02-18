package se.hjulverkstan.main.feature.ticket;

import se.hjulverkstan.main.error.exceptions.MissingArgumentException;
import se.hjulverkstan.main.error.exceptions.UnsupportedTicketStatusException;
import se.hjulverkstan.main.error.exceptions.UnsupportedTicketVehiclesException;
import se.hjulverkstan.main.feature.vehicle.model.Vehicle;
import se.hjulverkstan.main.feature.vehicle.model.VehicleStatus;

import java.util.List;

public class TicketUtils {
    public static void validateDtoBySelf(TicketDto dto) {

        if (dto.getTicketType() == TicketType.REPAIR && !hasChars(dto.getRepairDescription())) {
            throw new MissingArgumentException("repairDescription");
        }

        if (dto.getTicketType() == TicketType.RENT && dto.getEndDate() == null) {
            throw new MissingArgumentException("endDate");
        }
    }

    public static void validateDtoByContext(TicketDto dto, List<Vehicle> vehicles) {
        TicketType type = dto.getTicketType();

        boolean isRentOrDonate = type == TicketType.RENT || type == TicketType.DONATE;
        if (isRentOrDonate && vehicles.stream().anyMatch(Vehicle::isCustomerOwned)) {
            throw new UnsupportedTicketVehiclesException("Customer owned vehicles cannot be set for RENT or DONATE");
        }

        boolean hasCustomerOwned = vehicles.stream().anyMatch(Vehicle::isCustomerOwned);
        boolean hasNonCustomerOwned = vehicles.stream().anyMatch(v -> !v.isCustomerOwned());
        if (hasCustomerOwned && hasNonCustomerOwned) {
            throw new UnsupportedTicketVehiclesException("Cannot set customer owned and not customer owned vehicles");
        }

        if (vehicles.stream().anyMatch(v -> v.getLocation().getId() != dto.getLocationId())) {
            throw new UnsupportedTicketVehiclesException("Ticket contains vehicles of another location");
        }
    }

    private static boolean hasChars(String str) {
        return str != null && !str.isBlank();
    }

    public static void validateTicketStatusChange (Ticket ticket, TicketStatus status) {
        validateTicketStatusByType(ticket.getTicketType(), status);

        if (ticket.getTicketStatus() == status) {
            throw new UnsupportedTicketStatusException("Ticket status has to be different, is already " + status);
        }
    }

    public static void validateTicketStatusByType (TicketType ticketType, TicketStatus ticketStatus)  {
        if (!isValidTicketStatusByType(ticketType, ticketStatus)) {
            throw new UnsupportedTicketStatusException("Invalid status transition for ticket type: " + ticketStatus);
        }
    }

    public static boolean isValidTicketStatusByType(TicketType type, TicketStatus status) {
        if (type == TicketType.RENT) return status == TicketStatus.READY ||
                status == TicketStatus.IN_PROGRESS ||
                status == TicketStatus.CLOSED;

        if (type == TicketType.REPAIR) return status == TicketStatus.READY ||
                status == TicketStatus.IN_PROGRESS ||
                status == TicketStatus.COMPLETE ||
                status == TicketStatus.CLOSED;

        return status == null;
    }

    public static void updateVehiclesByTicketStatus(List<Vehicle> vehicles, Ticket ticket) {
        TicketStatus status = ticket.getTicketStatus();
        TicketType type = ticket.getTicketType();

        for (Vehicle vehicle : vehicles) {
            if (vehicle.isCustomerOwned()) {
                // Archive customer owned vehicles if ticket closed
                vehicle.setVehicleStatus(status == TicketStatus.CLOSED ? VehicleStatus.ARCHIVED : null);
            } else {
                // Set non-customer owned vehicles to unavailable if occupied by rent or repair
                boolean isRentingOut = type == TicketType.RENT && status == TicketStatus.IN_PROGRESS;
                boolean isRepairAndUnfinished = type == TicketType.REPAIR && status != TicketStatus.CLOSED;

                if (vehicle.getVehicleStatus() == VehicleStatus.AVAILABLE && (isRentingOut || isRepairAndUnfinished)) {
                    vehicle.setVehicleStatus(VehicleStatus.UNAVAILABLE);
                }
            }
        }
    }

    public static void updateVehiclesByTicketType(List<Vehicle> vehicles, Ticket ticket) {
        if (ticket.getTicketType() == TicketType.REPAIR && ticket.getTicketStatus() != TicketStatus.CLOSED) {
            for (Vehicle vehicle : vehicles) {
                // All vehicles on an ongoing repair should not be available
                if (vehicle.getVehicleStatus() == VehicleStatus.AVAILABLE && !vehicle.isCustomerOwned()) {
                    vehicle.setVehicleStatus(VehicleStatus.UNAVAILABLE);
                }
            }
        }
    }
}
