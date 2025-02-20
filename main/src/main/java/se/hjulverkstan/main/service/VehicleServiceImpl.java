package se.hjulverkstan.main.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.Exceptions.AlreadyUsedException;
import se.hjulverkstan.Exceptions.ElementNotFoundException;
import se.hjulverkstan.Exceptions.UnsupportedVehicleStatusException;
import se.hjulverkstan.Exceptions.UnsupportedVehicleTypeException;
import se.hjulverkstan.main.dto.vehicles.*;
import se.hjulverkstan.main.dto.responses.*;
import se.hjulverkstan.main.model.*;
import se.hjulverkstan.main.repository.LocationRepository;
import se.hjulverkstan.main.repository.VehicleRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class VehicleServiceImpl implements VehicleService {
    private final VehicleRepository vehicleRepository;
    private final LocationRepository locationRepository;
    public static String ELEMENT_VEHICLE = "Vehicle";
    public static String ELEMENT_LOCATION = "Location";

    @Autowired
    public VehicleServiceImpl(VehicleRepository vehicleRepository, LocationRepository locationRepository) {
        this.vehicleRepository = vehicleRepository;
        this.locationRepository = locationRepository;
    }

    @Override
    public VehicleDto createVehicle(NewVehicleDto newVehicle) {

        if (newVehicle instanceof NewVehiclebatchDto && newVehicle.getIsCustomerOwned() == null) {
            newVehicle.setIsCustomerOwned(Boolean.FALSE);
        }


        if (newVehicle.getRegTag() != null && !newVehicle.getIsCustomerOwned() && vehicleRepository.findByRegTag(newVehicle.getRegTag()).isPresent()) {
            throw new AlreadyUsedException("A vehicle with that regtag already exists");
        }

        Vehicle vehicle = createSpecificVehicleType(newVehicle);

        vehicle.setVehicleStatus(newVehicle.getVehicleStatus());
        vehicle.setImageURL(newVehicle.getImageURL());
        vehicle.setComment(newVehicle.getComment());
        vehicle.setTickets(new ArrayList<>());
        vehicle.setVehicleType(newVehicle.getVehicleType());
        vehicle.setCustomerOwned((newVehicle.getIsCustomerOwned()));


        if (!vehicle.isCustomerOwned()) {
            vehicle.setRegTag(newVehicle.getRegTag());
        }

        if (vehicle.isCustomerOwned()) {
            if (newVehicle.getVehicleStatus() != null && newVehicle.getVehicleStatus() != VehicleStatus.ARCHIVED) {
                throw new UnsupportedVehicleStatusException("A customer owned vehicle can only have the status ARCHIVED or no status at all");
            }
        }

        Location location = locationRepository.findById(newVehicle.getLocationId()).orElseThrow(() -> new ElementNotFoundException(ELEMENT_LOCATION));
        vehicle.setLocation(location);

        vehicleRepository.save(vehicle);

        return convertToDto(vehicle);
    }

    @Override
    public GetAllVehicleDto getAllVehicles() {

        List<Vehicle> listOfVehicles = vehicleRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        List<VehicleDto> responseList = new ArrayList<>();

        for (Vehicle vehicle : listOfVehicles) {
            responseList.add(convertToDto(vehicle));
        }
        return new GetAllVehicleDto(responseList);
    }

    @Override
    public VehicleDto deleteVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id).orElseThrow(() -> new ElementNotFoundException(ELEMENT_VEHICLE));
        vehicleRepository.delete(vehicle);
        return convertToDto(vehicle);
    }

    @Override
    public VehicleDto getVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id).orElseThrow(() -> new ElementNotFoundException(ELEMENT_VEHICLE));
        return convertToDto(vehicle);
    }

    @Override
    public EditVehicleDto editVehicle(Long id, EditVehicleDto editVehicle) {
        Vehicle selectedVehicle = vehicleRepository.findById(id).orElseThrow(() -> new ElementNotFoundException(ELEMENT_VEHICLE));

        editSpecificVehicleProperties(editVehicle, selectedVehicle);

        selectedVehicle.setImageURL(editVehicle.getImageURL());
        selectedVehicle.setComment(editVehicle.getComment());

        Location location = locationRepository.findById(editVehicle.getLocationId()).orElseThrow(() ->
                new ElementNotFoundException(ELEMENT_LOCATION));
        selectedVehicle.setLocation(location);

        // Check if regTag already exists except for the vehicle being edited
        if (editVehicle.getRegTag() != null && !selectedVehicle.isCustomerOwned()) {
            Optional<Vehicle> existingVehicle = vehicleRepository.findByRegTag(editVehicle.getRegTag());
            if (existingVehicle.isPresent() && !existingVehicle.get().getId().equals(selectedVehicle.getId())) {
                throw new AlreadyUsedException("A vehicle with that regtag already exists");
            }
        }


        selectedVehicle.setRegTag(selectedVehicle.isCustomerOwned() ? null : editVehicle.getRegTag());

        vehicleRepository.save(selectedVehicle);

        return convertToEditDto(selectedVehicle);
    }

    @Override
    public VehicleDto editVehicleStatus(Long id, EditVehicleStatusDto newStatus) {
        Vehicle selectedVehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException(ELEMENT_VEHICLE));

        for (Ticket ticket : selectedVehicle.getTickets()) {
            if (ticket.isOpen()) {
                throw new UnsupportedVehicleStatusException("Vehicle status cannot be changed when it has an active ticket.");
            }
        }

        selectedVehicle.setVehicleStatus(newStatus.getNewStatus());

        if (selectedVehicle.isCustomerOwned()) {
            if (newStatus.getNewStatus() != null && newStatus.getNewStatus() != VehicleStatus.ARCHIVED) {
                throw new UnsupportedVehicleStatusException("Customer-owned vehicles can only have the status ARCHIVED or no status at all.");
            }
        }

        vehicleRepository.save(selectedVehicle);
        return convertToDto(selectedVehicle);
    }

    //Private methods below
    private VehicleDto convertToDto(Vehicle vehicle) {
        if (vehicle instanceof VehicleBike) {
            return new VehicleBikeDto((VehicleBike) vehicle);

        } else if (vehicle instanceof VehicleStroller) {
            return new VehicleStrollerDto((VehicleStroller) vehicle);

        } else if (vehicle instanceof VehicleGeneric) {
            return new VehicleGenericDto((VehicleGeneric) vehicle);

        } else if (vehicle instanceof VehicleBatch) {
            return new VehicleBatchDto((VehicleBatch) vehicle);

        } else {
            return new VehicleDto(vehicle);
        }
    }

    private EditVehicleDto convertToEditDto(Vehicle vehicle){
        if (vehicle instanceof VehicleBike) {
            return new EditVehicleBikeDto((VehicleBike) vehicle);

        } else if (vehicle instanceof VehicleStroller) {
            return new EditVehicleStrollerDto((VehicleStroller) vehicle);

        } else if (vehicle instanceof VehicleGeneric) {
            return new EditVehicleGenericDto((VehicleGeneric) vehicle);

        } else if (vehicle instanceof VehicleBatch) {
            return new EditVehicleBatchDto((VehicleBatch) vehicle);

        } else {
            return new EditVehicleDto(vehicle);
        }

    }

    private static Vehicle createSpecificVehicleType(NewVehicleDto newVehicle) {
        if (newVehicle instanceof NewVehicleBikeDto newBikeDto) {
            return getVehicleBike(newBikeDto);

        } else if (newVehicle instanceof NewVehicleStrollerDto newStrollerDto) {
            return getVehicleStroller(newStrollerDto);

        } else if (newVehicle instanceof NewVehicleGenericDto newVehicleGenericDto) {
            return getVehicleGeneric(newVehicleGenericDto);

        } else if (newVehicle instanceof NewVehiclebatchDto newVehiclebatchDto) {
            return getVehicleBatch(newVehiclebatchDto);

        } else {
            throw new UnsupportedVehicleTypeException("The vehicletype is not supported");
        }
    }

    private static void editSpecificVehicleProperties(EditVehicleDto editVehicle, Vehicle selectedVehicle) {
        if (editVehicle instanceof EditVehicleBikeDto editBikeDto && selectedVehicle instanceof VehicleBike selectedBike) {
            selectedBike.setBikeType(editBikeDto.getBikeType());
            selectedBike.setGearCount(editBikeDto.getGearCount());
            selectedBike.setSize(editBikeDto.getSize());
            selectedBike.setBrakeType(editBikeDto.getBrakeType());
            selectedBike.setBrand(editBikeDto.getBrand());

        } else if (editVehicle instanceof EditVehicleStrollerDto editStrollerDto && selectedVehicle instanceof VehicleStroller selectedStroller) {
            selectedStroller.setStrollerType(editStrollerDto.getStrollerType());

        } else if (editVehicle instanceof EditVehicleGenericDto editGenericDto && selectedVehicle instanceof VehicleGeneric selectedGeneric) {
            selectedGeneric.setVehicleType(editGenericDto.getVehicleType());

        } else if (editVehicle instanceof EditVehicleBatchDto editBatchDto && selectedVehicle instanceof VehicleBatch selectedBatch) {
            selectedBatch.setBatchCount(editBatchDto.getBatchCount());
        } else {
            throw new UnsupportedVehicleTypeException(ELEMENT_VEHICLE);
        }
    }

    private static VehicleBike getVehicleBike(NewVehicleBikeDto newBikeDto) {
        VehicleBike vehicleBike = new VehicleBike();
        vehicleBike.setBikeType(newBikeDto.getBikeType());
        vehicleBike.setGearCount(newBikeDto.getGearCount());
        vehicleBike.setSize(newBikeDto.getSize());
        vehicleBike.setBrakeType(newBikeDto.getBrakeType());
        vehicleBike.setBrand(newBikeDto.getBrand());
        return vehicleBike;
    }

    private static VehicleStroller getVehicleStroller(NewVehicleStrollerDto newStrollerDto) {
        VehicleStroller vehicleStroller = new VehicleStroller();
        vehicleStroller.setStrollerType(newStrollerDto.getStrollerType());
        return vehicleStroller;
    }

    private static VehicleGeneric getVehicleGeneric(NewVehicleGenericDto newGenericDto) {
        VehicleGeneric vehicleGeneric = new VehicleGeneric();
        vehicleGeneric.setVehicleType(newGenericDto.getVehicleType());
        return vehicleGeneric;
    }

    private static VehicleBatch getVehicleBatch(NewVehiclebatchDto newBatchDto) {
        VehicleBatch vehicleBatch = new VehicleBatch();
        vehicleBatch.setBatchCount(newBatchDto.getBatchCount());
        return vehicleBatch;
    }
}