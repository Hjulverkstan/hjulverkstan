package se.hjulverkstan.main.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.dto.vehicles.VehicleDto;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAllVehicleDto {

    private List<VehicleDto> vehicles;
}