package se.hjulverkstan.main.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.hjulverkstan.Exceptions.ElementNotFoundException;
import se.hjulverkstan.main.dto.responses.GetAllVehicleDto;
import se.hjulverkstan.main.dto.responses.NewVehicleDto;
import se.hjulverkstan.main.dto.responses.VehicleDto;
import se.hjulverkstan.main.model.Vehicle;
import se.hjulverkstan.main.repository.VehicleRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class VehicleServiceImpl implements VehicleService {
    private final VehicleRepository vehicleRepository;
    public static String ELEMENT_NAME = "Vehicle";

    @Autowired
    public VehicleServiceImpl(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public VehicleDto createVehicle(NewVehicleDto newVehicle) {
        Vehicle vehicle = new Vehicle();

        vehicle.setVehicleType(newVehicle.getVehicleType());
        vehicle.setStatus(newVehicle.getStatus());
        vehicle.setLinkToImg(newVehicle.getLinkToImg());
        vehicle.setCreatedAt(LocalDateTime.now());
        vehicle.setCreatedBy(newVehicle.getCreatedBy());
        vehicle.setUpdatedAt(LocalDateTime.now());
        vehicle.setComment(newVehicle.getComment());

        vehicleRepository.save(vehicle);

        return new VehicleDto(vehicle);
    }

    @Override
    public GetAllVehicleDto getAllVehicles() {

        List<Vehicle> listOfVehicles = vehicleRepository.findAll();
        List<VehicleDto> responseList = new ArrayList<>();

        for (Vehicle vehicle : listOfVehicles) {
            responseList.add(new VehicleDto(vehicle));
        }
        return new GetAllVehicleDto(responseList);
    }

    @Override
    public VehicleDto deleteVehicle(Long id) {
        Optional<Vehicle> vehicleOpt = vehicleRepository.findById(id);

        if (vehicleOpt.isEmpty()) {
            throw new ElementNotFoundException(ELEMENT_NAME);
        }
        vehicleRepository.delete(vehicleOpt.get());
        return new VehicleDto(vehicleOpt.get());
    }

    @Override
    public VehicleDto getVehicleById(Long id) {
        Optional<Vehicle> vehicleOpt = vehicleRepository.findById(id);

        if (vehicleOpt.isEmpty()) {
            throw new ElementNotFoundException(ELEMENT_NAME);
        }
        return new VehicleDto(vehicleOpt.get());
    }

    @Override
    public VehicleDto editVehicle(Long id, VehicleDto vehicle) {
        Optional<Vehicle> vehicleOpt = vehicleRepository.findById(id);
        if (vehicleOpt.isEmpty()) {
            throw new ElementNotFoundException(ELEMENT_NAME);
        }

        Vehicle selectedVehicle = vehicleOpt.get();

        selectedVehicle.setVehicleType(vehicle.getVehicleType());
        selectedVehicle.setStatus(vehicle.getStatus());
        selectedVehicle.setLinkToImg(vehicle.getLinkToImg());
        selectedVehicle.setUpdatedAt(LocalDateTime.now());
        selectedVehicle.setComment(vehicle.getComment());

        vehicleRepository.save(selectedVehicle);

        return new VehicleDto(selectedVehicle);
    }
}