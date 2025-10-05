package se.hjulverkstan.main.feature.vehicle;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.feature.location.Location;
import se.hjulverkstan.main.feature.location.LocationRepository;
import se.hjulverkstan.main.feature.vehicle.model.Vehicle;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final LocationRepository locationRepository;

    public GetAllVehicleDto getAllVehicles() {
        List<Vehicle> vehicles = vehicleRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return new GetAllVehicleDto(vehicles);
    }

    public VehicleDto getVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Vehicle"));
        return new VehicleDto(vehicle);
    }

    @Transactional
    public VehicleDto createVehicle(VehicleDto dto) {
        VehicleUtils.validateDtoBySelf(dto);
        VehicleUtils.validateDtoByContext(dto, vehicleRepository);

        Vehicle vehicle = dto.applyToEntity(new Vehicle());
        applyDtoRelations(dto, vehicle);
        vehicleRepository.save(vehicle);

        return new VehicleDto(vehicle);
    }

    @Transactional
    public VehicleDto editVehicle(Long id, VehicleDto dto) {
        VehicleUtils.validateDtoBySelf(dto);

        Vehicle vehicle = vehicleRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Vehicle"));
        VehicleUtils.validateDtoByContext(dto, vehicleRepository);

        dto.applyToEntity(vehicle);
        applyDtoRelations(dto, vehicle);
        vehicleRepository.save(vehicle);

        return new VehicleDto(vehicle);
    }

    @Transactional
    public VehicleDto editVehicleStatus(Long id, VehicleStatusDto dto) {
        Vehicle vehicle = vehicleRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Vehicle"));

        VehicleUtils.validateStatusByContext(dto, vehicle);

        vehicle.setVehicleStatus(dto.getVehicleStatus());
        vehicleRepository.save(vehicle);

        return new VehicleDto(vehicle);
    }

    @Transactional
    public void deleteVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Vehicle"));

        vehicle.getTickets().forEach(ticket -> ticket.getVehicles().remove(vehicle));
        vehicleRepository.delete(vehicle);
    }

    private void applyDtoRelations(VehicleDto dto, Vehicle vehicle) {
        Location location = locationRepository.findById(dto.getLocationId())
                .orElseThrow(() -> new ElementNotFoundException("Location"));

        vehicle.setLocation(location);
    }
}