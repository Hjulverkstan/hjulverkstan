package se.hjulverkstan.main.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.Exceptions.ElementNotFoundException;
import se.hjulverkstan.Exceptions.UnsupportedVehicleTypeException;
import se.hjulverkstan.main.dto.vehicles.*;
import se.hjulverkstan.main.dto.responses.*;
import se.hjulverkstan.main.model.*;
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

    @Override
    public VehicleDto createVehicle(NewVehicleDto newVehicle) {
        Vehicle vehicle = createSpecificVehicleType(newVehicle);

        vehicle.setVehicleStatus(newVehicle.getVehicleStatus());
        vehicle.setImageURL(newVehicle.getImageURL());
        vehicle.setComment(newVehicle.getComment());
        vehicle.setTickets(new ArrayList<>());

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

        } else if (editVehicle instanceof VehicleStrollerDto editStrollerDto && selectedVehicle instanceof VehicleStroller selectedStroller) {
            selectedStroller.setStrollerType(editStrollerDto.getStrollerType());
            selectedStroller.setFoldable(editStrollerDto.getIsFoldable());
            selectedStroller.setHasStorageBasket(editStrollerDto.getHasStorageBasket());
            selectedVehicle.setVehicleType(VehicleType.STROLLER);

        } else if (editVehicle instanceof VehicleScooterDto editScooterDto && selectedVehicle instanceof VehicleScooter selectedScooter) {
            selectedScooter.setFoldable(editScooterDto.getIsFoldable());
            selectedScooter.setBrakeType(editScooterDto.getBrakeType());
            selectedScooter.setScooterType(editScooterDto.getScooterType());
            selectedVehicle.setVehicleType(VehicleType.SCOOTER);

        } else {
            throw new UnsupportedVehicleTypeException(ELEMENT_NAME);
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

        } else if (vehicle instanceof VehicleStroller) {
            return new VehicleStrollerDto((VehicleStroller) vehicle);

        } else if (vehicle instanceof VehicleScooter) {
            return new VehicleScooterDto((VehicleScooter) vehicle);
        }
        return new VehicleDto(vehicle);
    }

    private static Vehicle createSpecificVehicleType(NewVehicleDto newVehicle) {
        if (newVehicle instanceof NewVehicleBikeDto newBikeDto) {
            return getVehicleBike(newBikeDto);

        } else if (newVehicle instanceof NewVehicleStrollerDto newStrollerDto) {
            return getVehicleStroller(newStrollerDto);

        } else if (newVehicle instanceof NewVehicleScooterDto newScooterDto) {
            return getVehicleScooter(newScooterDto);

        } else {
            throw new UnsupportedVehicleTypeException("The vehicletype is not supported");
        }
    }

    private static VehicleBike getVehicleBike(NewVehicleBikeDto newBikeDto) {
        VehicleBike vehicleBike = new VehicleBike();
        vehicleBike.setVehicleType(VehicleType.BIKE);
        vehicleBike.setBikeType(newBikeDto.getBikeType());
        vehicleBike.setGearCount(newBikeDto.getGearCount());
        vehicleBike.setSize(newBikeDto.getSize());
        vehicleBike.setBrakeType(newBikeDto.getBrakeType());
        return vehicleBike;
    }

    private static VehicleStroller getVehicleStroller(NewVehicleStrollerDto newStrollerDto) {
        VehicleStroller vehicleStroller = new VehicleStroller();
        vehicleStroller.setVehicleType(VehicleType.STROLLER);
        vehicleStroller.setFoldable(newStrollerDto.getIsFoldable());
        vehicleStroller.setHasStorageBasket(newStrollerDto.getHasStorageBasket());
        vehicleStroller.setStrollerType(newStrollerDto.getStrollerType());
        return vehicleStroller;
    }

    private static VehicleScooter getVehicleScooter(NewVehicleScooterDto newScooterDto) {
        VehicleScooter vehicleScooter = new VehicleScooter();
        vehicleScooter.setVehicleType(VehicleType.SCOOTER);
        vehicleScooter.setFoldable(newScooterDto.getIsFoldable());
        vehicleScooter.setBrakeType(newScooterDto.getBrakeType());
        vehicleScooter.setScooterType(newScooterDto.getScooterType());
        return vehicleScooter;
    }
}