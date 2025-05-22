package se.hjulverkstan.main;

import java.time.LocalDateTime;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.model.Location;
import se.hjulverkstan.main.model.LocationType;
import se.hjulverkstan.main.repository.LocationRepository;

@Service
public class TestService {

    @Autowired
    private LocationRepository locationRepository;

    @Transactional
    public void createLocation() {
        Location location = new Location();
        location.setAddress("some address");
        location.setName("some name");
        location.setLocationType(LocationType.SHOP);
        location.setComment(null);
        location.setVehicles(new ArrayList<>());
        location.setCreatedBy(1L);
        location.setCreatedAt(LocalDateTime.now());
        location.setUpdatedBy(1L);
        location.setUpdatedAt(LocalDateTime.now());
        locationRepository.saveAndFlush(location);
    }
}
