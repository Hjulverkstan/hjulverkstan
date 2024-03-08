package se.hjulverkstan.main.service;

import se.hjulverkstan.main.dto.responses.GetAllVehicleDto;
import se.hjulverkstan.main.dto.vehicles.NewVehicleDto;
import se.hjulverkstan.main.dto.vehicles.VehicleDto;

public interface VehicleService {
    VehicleDto createVehicle(NewVehicleDto newVehicle);

    GetAllVehicleDto getAllVehicles();

    VehicleDto deleteVehicle(Long id);

    VehicleDto getVehicleById(Long id);

    VehicleDto editVehicle(Long id, VehicleDto Vehicle);
}