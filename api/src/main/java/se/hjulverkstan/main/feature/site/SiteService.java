package se.hjulverkstan.main.feature.site;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.feature.vehicle.GetAllVehicleDto;
import se.hjulverkstan.main.feature.vehicle.VehicleDto;
import se.hjulverkstan.main.feature.vehicle.model.Vehicle;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class SiteService {
    private final SiteRepository siteRepository;

    public GetAllVehicleDto findPublicAvailableVehicles(Long locationId) {
        List<Vehicle> vehicles = siteRepository.findPublicAvailableVehicles(locationId);
        return new GetAllVehicleDto(vehicles);
    }

    public VehicleDto findById(Long id) {
        Vehicle vehicle = siteRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Vehicle"));
        return new VehicleDto(vehicle);
    }
}
