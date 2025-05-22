package se.hjulverkstan.main.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import se.hjulverkstan.Exceptions.CouldNotDeleteException;
import se.hjulverkstan.Exceptions.ElementNotFoundException;
import se.hjulverkstan.main.dto.LocationDto;
import se.hjulverkstan.main.dto.NewLocationDto;
import se.hjulverkstan.main.dto.responses.GetAllLocationDto;
import se.hjulverkstan.main.model.Location;
import se.hjulverkstan.main.model.Vehicle;
import se.hjulverkstan.main.repository.LocationRepository;
import se.hjulverkstan.main.repository.VehicleRepository;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;

@Service
public class LocationServiceImpl implements LocationService {
    private final LocationRepository locationRepository;
    private final VehicleRepository vehicleRepository;
    public static final String ELEMENT_LOCATION = "Location";
    public static final String ELEMENT_VEHICLE = "Vehicle";

    @Autowired
    public LocationServiceImpl(LocationRepository locationRepository, VehicleRepository vehicleRepository) {
        this.locationRepository = locationRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public GetAllLocationDto getAllLocation() {
        List<Location> locations = locationRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        List<LocationDto> responseList = new ArrayList<>();

        for (Location location : locations) {
            responseList.add(new LocationDto(location));
        }

        return new GetAllLocationDto(responseList);
    }

    // wrap at highest level of transaction
    @Override
    @Transactional
    public LocationDto getLocationById(Long id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException(ELEMENT_LOCATION));

        return new LocationDto(location);
    }

    @Override
    public LocationDto deleteLocation(Long id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException(ELEMENT_LOCATION));

        if (location.getVehicles() != null && !location.getVehicles().isEmpty()) {
            throw new CouldNotDeleteException(ELEMENT_LOCATION);
        }

        locationRepository.delete(location);
        return new LocationDto(location);
    }

    @PersistenceContext
    private EntityManager entityManager;

    public void printTxInfo(String label) {
        boolean active = TransactionSynchronizationManager.isActualTransactionActive();
        Connection conn = entityManager.unwrap(Session.class)
                .doReturningWork(e -> e.unwrap(Connection.class));
        System.out.println(label + " | TX active: " + active + " | Connection: " + conn.hashCode());
    }

    @Override
    public LocationDto editLocation(Long id, LocationDto location) {

        printTxInfo("tx in editLocation");

        Location selectedLocation = locationRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException(ELEMENT_LOCATION));

        selectedLocation.setAddress(location.getAddress());
        selectedLocation.setName(location.getName());
        selectedLocation.setLocationType(location.getLocationType());
        selectedLocation.setComment(location.getComment());

        List<Vehicle> vehicles = vehicleRepository.findAllById(location.getVehicleIds());

        vehicles.forEach(vehicle -> {
            vehicle.setLocation(selectedLocation);
            vehicleRepository.save(vehicle);  // optional ?
        });

        // selectedLocation.setVehicles(vehicles); // optional ?
        locationRepository.save(selectedLocation); // optinal

        //vehicleRepository.flush();
        //locationRepository.flush();

        return new LocationDto(selectedLocation);
    }

    @Override
    public LocationDto createLocation(NewLocationDto newLocation) {
        Location location = new Location();
        location.setAddress(newLocation.getAddress());
        location.setName(newLocation.getName());
        location.setLocationType(newLocation.getLocationType());
        location.setComment(newLocation.getComment());
        location.setVehicles(new ArrayList<>());
        locationRepository.save(location);
        return new LocationDto(location);
    }
}