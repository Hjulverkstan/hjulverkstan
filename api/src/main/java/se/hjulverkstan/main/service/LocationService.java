package se.hjulverkstan.main.service;

import se.hjulverkstan.main.dto.LocationDto;
import se.hjulverkstan.main.dto.NewLocationDto;
import se.hjulverkstan.main.dto.responses.GetAllLocationDto;

public interface LocationService {
    GetAllLocationDto getAllLocation();

    LocationDto getLocationById(Long id);

    LocationDto deleteLocation(Long id);

    LocationDto editLocation(Long id, LocationDto location);

    LocationDto createLocation(NewLocationDto newLocation);
}