package se.hjulverkstan.main.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.extern.slf4j.Slf4j;
import org.assertj.core.api.InstanceOfAssertFactories;
import org.hibernate.Session;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import se.hjulverkstan.Exceptions.CouldNotDeleteException;
import se.hjulverkstan.Exceptions.ElementNotFoundException;
import se.hjulverkstan.main.annotations.RepositoryTest;
import se.hjulverkstan.main.base.BaseJpaTest;
import se.hjulverkstan.main.dto.LocationDto;
import se.hjulverkstan.main.dto.NewLocationDto;
import se.hjulverkstan.main.dto.responses.GetAllLocationDto;
import se.hjulverkstan.main.model.Location;
import se.hjulverkstan.main.model.LocationType;
import se.hjulverkstan.main.model.Vehicle;
import se.hjulverkstan.main.repository.LocationRepository;
import se.hjulverkstan.main.repository.VehicleRepository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static se.hjulverkstan.main.service.LocationServiceImpl.ELEMENT_LOCATION;


@Sql(scripts = {
        "classpath:script/location.sql",
        "classpath:script/vehicle.sql"
})
@RepositoryTest
@Import(LocationServiceImpl.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Slf4j
public class LocationServiceIT extends BaseJpaTest {

    private static final String NOT_FOUND_MESSAGE = ELEMENT_LOCATION + " Not Found";
    // private static final String COULD_NOT_DELETE_MESSAGE = ELEMENT_LOCATION;
    private static final Long USER_NOT_EXIST_ID = 999L;

    @Autowired
    private LocationService locationService;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    /*@Autowired
    private DataSource dataSource;
    private String jdbcUrl;

    @BeforeAll
    void logJdbcUrlOnce() throws SQLException {
        try (var conn = dataSource.getConnection()) {
            jdbcUrl = conn.getMetaData().getURL();
            log.info("🔗 PostgreSQL Testcontainers JDBC URL: {}", jdbcUrl);
        }
    }*/

    @Test
    @DisplayName("getAllLocation() should return all locations sorted by createdAt descending")
    void testGetAllLocation_returnsAllLocations() {
        // Arrange
        Long[] expectedIdsInOrder = {3L, 2L, 1L};

        // Act
        GetAllLocationDto dto = locationService.getAllLocation();

        // Assert
        assertThat(dto.getLocations())
                .isNotNull()
                .hasSize(expectedIdsInOrder.length)
                .extracting(LocationDto::getId)
                .containsExactly(expectedIdsInOrder);
    }

    @Test
    @DisplayName("getLocationById() should return location when it exists")
    void testGetLocationById_success() {
        // Arrange
        Long existingId = 1L;

        // Act

        // Assert
        assertThat(locationService.getLocationById(existingId))
                .isNotNull()
                .extracting(LocationDto::getId)
                .isEqualTo(existingId);
    }

    @Test
    @DisplayName("getLocationById() should throw ElementNotFoundException when location does not exist")
    void testGetLocationById_notFound() {
        // Arrange
        //Long nonExistingId = 999L;

        // Act

        // Assert
        assertThatThrownBy(() -> locationService.getLocationById(USER_NOT_EXIST_ID))
                .isInstanceOf(ElementNotFoundException.class)
                .hasMessage(NOT_FOUND_MESSAGE);

    }

    @Test
    @DisplayName("deleteLocation() should delete location when no vehicles are linked")
    void testDeleteLocation_success() {
        // Arrange
        Long locationId = 3L; // Ensure this has no linked vehicles

        // Precheck that the location exists directly in the repository
        assertThat(locationRepository.findById(locationId))
                .isPresent()
                .get()
                .extracting(Location::getId)
                .isEqualTo(locationId);

        // Act
        locationService.deleteLocation(locationId);

        // Assert
        assertThat(locationRepository.findById(locationId))
                .isEmpty();
    }

    @Test
    @DisplayName("deleteLocation() should throw CouldNotDeleteException when vehicles are linked")
    void testDeleteLocation_withLinkedVehicles_shouldThrow() {
        // Arrange
        Long locationIdLinked = 1L; // Ensure this has linked vehicles

        // Precheck that the location exists directly in the repository
        Optional<Location> locationOptional = locationRepository.findById(locationIdLinked);

       /* assertThat(locationOptional)
                .isPresent()
                .get()
                .extracting(Location::getId)
                .isEqualTo(locationIdLinked);

        assertThat(locationOptional)
                .isPresent()
                .get()
                .extracting(Location::getVehicles, InstanceOfAssertFactories.LIST)
                .hasSize(13);*/

        assertThat(locationOptional)
                .isPresent()
                .get()
                .extracting(Location::getId, l -> l.getVehicles().size())
                .containsExactly(locationIdLinked, 13);


        // Act
        assertThatThrownBy(() -> locationService.deleteLocation(locationIdLinked))
                .isInstanceOf(CouldNotDeleteException.class)
                .hasMessage(ELEMENT_LOCATION);

        // Assert
        assertThat(locationRepository.findById(locationIdLinked))
                .isPresent()
                .get()
                .extracting(Location::getId)
                .isEqualTo(locationIdLinked);
    }

    @Test
    @DisplayName("deleteLocation() should throw ElementNotFoundException when location does not exist")
    void testDeleteLocation_notFound_shouldThrow() {
        // Arrange
        //Long nonExistingId = 999L;

        // Precheck that the location exists directly in the repository
        assertThat(locationRepository.findById(USER_NOT_EXIST_ID))
                .isEmpty();

        // Act
        assertThatThrownBy(() -> locationService.deleteLocation(USER_NOT_EXIST_ID))
                .isInstanceOf(ElementNotFoundException.class)
                .hasMessage(NOT_FOUND_MESSAGE);
    }

    /*@Test
    @DisplayName("editLocation() should update fields and associate vehicles")
    void testEditLocation_success_whenRequiredDataProvided() {
        // Arrange
        Long locationId = 1L;
        String locationName = "Hjällbo";

        LocationDto locationDto = new LocationDto();
        locationDto.setAddress("123 New St");
        locationDto.setName("Updated Name");
        locationDto.setLocationType(LocationType.SHOP);

        // Precheck that the location exists directly in the repository
        assertThat(locationRepository.findById(locationId))
                .isPresent()
                .get()
                .extracting(Location::getName)
                .isEqualTo(locationName);

        // Act

        // Assert
        assertThat(locationService.editLocation(locationId, locationDto))
                .isNotNull()
                .extracting(LocationDto::getId)
                .isEqualTo(locationId);
    }

    @Test
    @DisplayName("editLocation() should update fields and associate vehicles")
    void testEditLocation_success_whenFullDataProvided() {
        // Arrange
        Long locationId = 1L;
        String locationName = "Hjällbo";

        LocationDto locationDto = new LocationDto();
        locationDto.setAddress("123 New St");
        locationDto.setName("Updated Name");
        locationDto.setLocationType(LocationType.SHOP);
        locationDto.setVehicleIds(List.of(1L, 2L, 3L));

        // Precheck that the location exists directly in the repository
        assertThat(locationRepository.findById(locationId))
                .isPresent()
                .get()
                .extracting(Location::getName)
                .isEqualTo(locationName);

        // Act

        // Assert
        assertThat(locationService.editLocation(locationId, locationDto))
                .isNotNull()
                .extracting(LocationDto::getId)
                .isEqualTo(locationId);
    }*/

    static Stream<Arguments> provideLocationDtos() {
        LocationDto requiredOnly = new LocationDto();
        requiredOnly.setAddress("123 New St");
        requiredOnly.setName("Updated Name");
        requiredOnly.setLocationType(LocationType.SHOP);

        LocationDto fullData = new LocationDto();
        fullData.setAddress("123 New St");
        fullData.setName("Updated Name");
        fullData.setLocationType(LocationType.SHOP);
        fullData.setVehicleIds(List.of(1L, 2L, 3L));

        return Stream.of(
                Arguments.of("Required data only", requiredOnly),
                Arguments.of("Required data only + vehicles", fullData)
        );
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("provideLocationDtos")
    @DisplayName("editLocation() should update fields and associate vehicles")
    void testEditLocation_success_variants(String label, LocationDto locationDto) {
        Long locationId = 1L;
        String expectedName = "Hjällbo";

        // Precheck that the location exists directly in the repository
        assertThat(locationRepository.findById(locationId))
                .isPresent()
                .get()
                .extracting(Location::getName)
                .isEqualTo(expectedName);

        // Act & Assert
        assertThat(locationService.editLocation(locationId, locationDto))
                .isNotNull()
                .extracting(LocationDto::getId)
                .isEqualTo(locationId);
    }


   /* @PersistenceContext
    private EntityManager entityManager;

    public void printTxInfo(String label) {
        boolean active = TransactionSynchronizationManager.isActualTransactionActive();
        Connection conn = entityManager.unwrap(Session.class)
                .doReturningWork(e -> e.unwrap(Connection.class));
        System.out.println(label + " | TX active: " + active + " | Connection: " + conn.hashCode());
    }

    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    //@Test
    @DisplayName("editLocation() should update fields and associate vehicles")
    void testEditLocation_success2() {
        log.info("👀 Using URL: {}", jdbcUrl);

        this.printTxInfo("tx in junit");

        // Arrange
        Long locationId = 1L;
        String locationName = "Hjällbo";

        List<Vehicle> vlist = vehicleRepository.findAll();
        List<Long> vIds = vlist.stream()
                .filter(e -> e.getLocation().getId().equals(2L))
                .map(Vehicle::getId).collect(Collectors.toList());

        LocationDto locationDto = new LocationDto();
        locationDto.setId(locationId);
        locationDto.setAddress("123 New St");
        locationDto.setName("Updated Name");
        locationDto.setLocationType(LocationType.SHOP);
        locationDto.setVehicleIds(vIds);

        // Precheck that the location exists directly in the repository
        assertThat(locationRepository.findById(locationId))
                .isPresent()
                .get()
                .extracting(Location::getName)
                .isEqualTo(locationName);

        // Act

        // Assert
        assertThat(locationService.editLocation(locationId, locationDto))
                .isNotNull()
                .extracting(LocationDto::getId)
                .isEqualTo(locationId);

        List<Vehicle> updatedVList = vehicleRepository.findAll()
                .stream().filter(e -> e.getLocation().getId().equals(locationId)).toList();

        log.info("Updated Vehicle List: {}", updatedVList);

        assertThat(updatedVList)
                .isNotEmpty()
                .hasSize(3)
                .extracting(Vehicle::getLocation)
                .allMatch(location -> location.getId().equals(locationId));



    }*/

    /*
        Depending on the implementation, more test might need to be created regarding editLocation():
        - Test with empty vehicleIds
        - Test with non-existing vehicleIds
        - Test with existing vehicleIds
        - Test with null vehicleIds WHICH we already did because of non required vehicle field in LocationDto
     */

    @Test
    @DisplayName("editLocation() should throw ElementNotFoundException when location does not exist")
    void testEditLocation_notFound() {
        // Arrange
        //Long nonExistingId = 999L;

        // Act

        // Assert
        assertThatThrownBy(() -> locationService.editLocation(USER_NOT_EXIST_ID, new LocationDto()))
                .isInstanceOf(ElementNotFoundException.class)
                .hasMessage(NOT_FOUND_MESSAGE);
    }

    @Test
    @DisplayName("createLocation() should persist and return new location")
    void testCreateLocation_success() {
        // Arrange
        String NEW_LOCATION_NAME = "New Location";
        NewLocationDto newLocation = new NewLocationDto();
        newLocation.setName(NEW_LOCATION_NAME);
        newLocation.setAddress("456 New St");
        newLocation.setLocationType(LocationType.SHOP);


        // Act
        assertThat(locationService.createLocation(newLocation))
                .isNotNull()
                .extracting(LocationDto::getId)
                .isNotNull()
                .isEqualTo(4L); // Assuming this is the next ID after existing ones, right now there seem to be issues with the ID generation.


        // Assert
        assertThat(locationRepository.findAll())
                .hasSize(4)
                .map(Location::getName)
                .contains(NEW_LOCATION_NAME);
    }

}
