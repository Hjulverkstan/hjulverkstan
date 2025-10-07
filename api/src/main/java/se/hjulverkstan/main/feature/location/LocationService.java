package se.hjulverkstan.main.feature.location;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.error.exceptions.CouldNotDeleteException;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.shared.ListResponseDto;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class LocationService {

    private final LocationRepository locationRepository;

    public ListResponseDto<LocationDto> getAllLocations() {
        List<Location> locations = locationRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return new ListResponseDto<>(locations.stream().map(LocationDto::new).toList());
    }

    public LocationDto getLocationById(Long id) {
        Location location = locationRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Location"));
        return new LocationDto(location);
    }

    @Transactional
    public LocationDto createLocation(LocationDto dto) {
        Location location = dto.applyToEntity(new Location());
        locationRepository.save(location);

        return new LocationDto(location);
    }

    @Transactional
    public LocationDto editLocation(Long id, LocationDto dto) {
        Location location = locationRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Location"));

        dto.applyToEntity(location);
        locationRepository.save(location);

        return new LocationDto(location);
    }

    @Transactional
    public void deleteLocation(Long id) {
        Location location = locationRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Location"));

        if (location.getVehicles() != null && !location.getVehicles().isEmpty()) {
            throw new CouldNotDeleteException("Location has associated vehicles");
        }

        if (location.getShop() != null) {
            throw new CouldNotDeleteException("Location has an associated shop");
        }

        locationRepository.delete(location);
    }
}