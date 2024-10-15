package se.hjulverkstan.main.service;

import se.hjulverkstan.main.dto.responses.GetAllVehicleDto;
import se.hjulverkstan.main.dto.vehicles.EditVehicleDto;
import se.hjulverkstan.main.dto.vehicles.NewVehicleDto;
import se.hjulverkstan.main.dto.vehicles.NewVehicleStatusDto;
import se.hjulverkstan.main.dto.vehicles.VehicleDto;

public interface VehicleService {
    VehicleDto createVehicle(NewVehicleDto newVehicle);

    GetAllVehicleDto getAllVehicles();

    VehicleDto deleteVehicle(Long id);

    VehicleDto getVehicleById(Long id);

    EditVehicleDto editVehicle(Long id, EditVehicleDto Vehicle);
    VehicleDto editVehicleStatus(Long id, NewVehicleStatusDto newStatus);
}