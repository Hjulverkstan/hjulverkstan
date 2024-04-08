package se.hjulverkstan.main.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.hjulverkstan.Exceptions.ElementNotFoundException;
import se.hjulverkstan.main.dto.LocationDto;
import se.hjulverkstan.main.dto.NewLocationDto;
import se.hjulverkstan.main.dto.responses.GetAllLocationDto;
import se.hjulverkstan.main.model.Location;
import se.hjulverkstan.main.repository.LocationRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class LocationServiceImpl implements LocationService {
    private final LocationRepository locationRepository;
    public static final String ELEMENT_NAME = "Location";

    @Autowired
    public LocationServiceImpl(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    @Override
    public GetAllLocationDto getAllLocation() {
        List<Location> locations = locationRepository.findAll();
        List<LocationDto> responseList = new ArrayList<>();

        for (Location location : locations) {
            responseList.add(new LocationDto(location));
        }

        return new GetAllLocationDto(responseList);
    }

    @Override
    public LocationDto getLocationById(Long id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException(ELEMENT_NAME));

        return new LocationDto(location);
    }

    @Override
    public LocationDto deleteLocation(Long id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException(ELEMENT_NAME));

        locationRepository.delete(location);
        return new LocationDto(location);
    }

    @Override
    public LocationDto editLocation(Long id, LocationDto location) {
        Location selectedLocation = locationRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException(ELEMENT_NAME));

        selectedLocation.setAddress(location.getAddress());
        selectedLocation.setName(location.getName());
        selectedLocation.setLocationType(location.getLocationType());
        selectedLocation.setComment(location.getComment());

        locationRepository.save(selectedLocation);
        return new LocationDto(selectedLocation);
    }

    @Override
    public LocationDto createLocation(NewLocationDto newLocation) {
        Location location = new Location();
        location.setAddress(newLocation.getAddress());
        location.setName(newLocation.getName());
        location.setLocationType(newLocation.getLocationType());
        location.setComment(newLocation.getComment());

        locationRepository.save(location);
        return new LocationDto(location);
    }
}