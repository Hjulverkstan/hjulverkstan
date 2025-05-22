package se.hjulverkstan.main.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.jdbc.Sql;
import se.hjulverkstan.main.annotations.RepositoryTest;
import se.hjulverkstan.main.dto.responses.GetAllVehicleDto;

import static org.assertj.core.api.Assertions.assertThat;

@Sql(scripts = {
        "classpath:script/location.sql",
        "classpath:script/vehicle.sql"
})
@RepositoryTest
@Import(VehicleServiceImpl.class)
public class VehicleServiceIT {

    @Autowired
    private VehicleService vehicleService;

    @Test
    void getAllVehicles_shouldReturnAllVehicles() {
        GetAllVehicleDto allVehicles = vehicleService.getAllVehicles();
        assertThat(allVehicles).isNotNull();
        assertThat(allVehicles.getVehicles()).isNotNull();
        assertThat(allVehicles.getVehicles()).hasSize(16);
    }
}
