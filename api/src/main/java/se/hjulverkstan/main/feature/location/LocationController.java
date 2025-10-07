package se.hjulverkstan.main.feature.location;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.main.shared.ListResponseDto;

@RestController
@RequestMapping("v1/api/location")
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;

    @GetMapping()
    @PreAuthorize("hasRole('ROLE_USER')")
    public ListResponseDto<LocationDto> getAllLocations() {
        return locationService.getAllLocations();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public LocationDto getLocationById(@PathVariable Long id) {
        return locationService.getLocationById(id);
    }

    @PostMapping()
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public LocationDto createLocation(@Valid @RequestBody LocationDto dto) {
        return locationService.createLocation(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public LocationDto editLocation(@PathVariable Long id, @Valid @RequestBody LocationDto location) {
        return locationService.editLocation(id, location);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLocation(@PathVariable Long id) {
        locationService.deleteLocation(id);
    }
}