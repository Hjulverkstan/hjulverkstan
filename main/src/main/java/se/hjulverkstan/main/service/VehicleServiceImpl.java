package se.hjulverkstan.main.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.Exceptions.ElementNotFoundException;
import se.hjulverkstan.main.dto.responses.*;
import se.hjulverkstan.main.model.Vehicle;
import se.hjulverkstan.main.model.VehicleBike;
import se.hjulverkstan.main.model.VehicleType;
import se.hjulverkstan.main.repository.VehicleRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class VehicleServiceImpl implements VehicleService {
    private final VehicleRepository vehicleRepository;
    public static String ELEMENT_NAME = "Vehicle";

    @Autowired
    public VehicleServiceImpl(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    //TODO Need to add more vehicle types later on
    @Override
    public VehicleDto createVehicle(NewVehicleDto newVehicle) {
        Vehicle vehicle = createSpecificVehicleType(newVehicle);

        vehicle.setVehicleStatus(newVehicle.getVehicleStatus());
        vehicle.setImageURL(newVehicle.getImageURL());
        vehicle.setComment(newVehicle.getComment());

        vehicleRepository.save(vehicle);

        return convertToDto(vehicle);
    }

    @Override
    public GetAllVehicleDto getAllVehicles() {

        List<Vehicle> listOfVehicles = vehicleRepository.findAll();
        List<VehicleDto> responseList = new ArrayList<>();

        for (Vehicle vehicle : listOfVehicles) {
            responseList.add(convertToDto(vehicle));
        }
        return new GetAllVehicleDto(responseList);
    }

    @Override
    public VehicleDto deleteVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id).orElseThrow(() -> new ElementNotFoundException(ELEMENT_NAME));
        vehicleRepository.delete(vehicle);
        return convertToDto(vehicle);
    }

    @Override
    public VehicleDto getVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id).orElseThrow(() -> new ElementNotFoundException(ELEMENT_NAME));
        return convertToDto(vehicle);
    }

    @Override
    public VehicleDto editVehicle(Long id, VehicleDto editVehicle) {
        Vehicle selectedVehicle = vehicleRepository.findById(id).orElseThrow(() -> new ElementNotFoundException(ELEMENT_NAME));

        if (editVehicle instanceof VehicleBikeDto editBikeDto && selectedVehicle instanceof VehicleBike selectedBike) {
            selectedBike.setBikeType(editBikeDto.getBikeType());
            selectedBike.setGearCount(editBikeDto.getGearCount());
            selectedBike.setSize(editBikeDto.getSize());
            selectedBike.setBrakeType(editBikeDto.getBrakeType());
            selectedVehicle.setVehicleType(VehicleType.BIKE);
        } else {
            // TODO Change the Exception later on
            throw new ElementNotFoundException("Bike type not found");
        }

        selectedVehicle.setVehicleStatus(editVehicle.getVehicleStatus());
        selectedVehicle.setImageURL(editVehicle.getImageURL());
        selectedVehicle.setComment(editVehicle.getComment());

        vehicleRepository.save(selectedVehicle);

        return convertToDto(selectedVehicle);
    }

    //Private methods below
    private VehicleDto convertToDto(Vehicle vehicle) {
        if (vehicle instanceof VehicleBike) {
            return new VehicleBikeDto((VehicleBike) vehicle);
        }
        return new VehicleDto(vehicle);
    }

    private static Vehicle createSpecificVehicleType(NewVehicleDto newVehicle) {
        if (newVehicle instanceof NewVehicleBikeDto newBikeDto) {
            VehicleBike vehicleBike = new VehicleBike();

            vehicleBike.setVehicleType(VehicleType.BIKE);
            vehicleBike.setBikeType(newBikeDto.getBikeType());
            vehicleBike.setGearCount(newBikeDto.getGearCount());
            vehicleBike.setSize(newBikeDto.getSize());
            vehicleBike.setBrakeType(newBikeDto.getBrakeType());

            return vehicleBike;
        } else {
            // TODO: Change the Exception type later on
            throw new ElementNotFoundException("Vehicle type not found!");
        }
    }
}