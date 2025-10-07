package se.hjulverkstan.main.feature.site;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.feature.vehicle.VehicleDto;
import se.hjulverkstan.main.feature.vehicle.model.Vehicle;
import se.hjulverkstan.main.shared.ListResponseDto;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class SiteService {
    private final SiteRepository siteRepository;

    public ListResponseDto<VehicleDto> findPublicAvailableVehicles(Long locationId) {
        List<Vehicle> vehicles = siteRepository.findPublicAvailableVehicles(locationId);
        return new ListResponseDto<>(vehicles.stream().map(VehicleDto::new).toList());
    }

    public VehicleDto findById(Long id) {
        Vehicle vehicle = siteRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Vehicle"));
        return new VehicleDto(vehicle);
    }
}
