package se.hjulverkstan.main.feature.vehicle;

import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.feature.vehicle.model.Vehicle;

import java.util.List;

@Data
@NoArgsConstructor
public class GetAllVehicleDto {
    private List<VehicleDto> vehicles;

    public GetAllVehicleDto (List<Vehicle> vehicles) {
        this.vehicles = vehicles.stream().map(VehicleDto::new).toList();
    }
}