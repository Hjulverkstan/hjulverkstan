package se.hjulverkstan.main.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.hjulverkstan.Exceptions.VehicleNotFoundException;
import se.hjulverkstan.main.model.Vehicle;
import se.hjulverkstan.main.repository.VehicleRepository;

import java.util.List;
import java.util.Optional;

@Service
public class VehicleServiceImpl implements VehicleService {

    @Autowired
    VehicleRepository vehicleRepository;

    @Override
    public void createVehicle(Vehicle vehicle) {
        vehicleRepository.save(vehicle);

    }

    @Override
    public List<Vehicle> getAllVehicles() throws VehicleNotFoundException {

        

    }

    @Override
    public void deleteVehicle(Long id) throws VehicleNotFoundException {
        Optional<Vehicle> vehicleToDelete = vehicleRepository.findById(id);

        if (vehicleToDelete.isEmpty()) {
            throw new VehicleNotFoundException("Unable to find a vehicle with the ID :" + id);
        }

        vehicleToDelete.ifPresent(vehicleRepository::delete);
    }

    @Override
    public Vehicle getVehicleById(Long id) throws VehicleNotFoundException {
        Optional<Vehicle> findVehicle = vehicleRepository.findById(id);

        if (findVehicle.isEmpty()) {
            throw new VehicleNotFoundException("Unable to find a vehicle with the ID :" + id);
        }
        return findVehicle.get();
    }

    @Override
    public void updateVehicle(Long id, Vehicle currentVehicle) throws VehicleNotFoundException {
        Optional<Vehicle> vehicleToUpdate = vehicleRepository.findById(id);
        if (vehicleToUpdate.isEmpty()) {
            throw new VehicleNotFoundException("Unable to find a vehicle with the ID :" + id);
        }

        Vehicle updatingVehicle = vehicleToUpdate.get();
        updatingVehicle.setVehicleType(currentVehicle.getVehicleType());
        updatingVehicle.setStatus(currentVehicle.getStatus());
        updatingVehicle.setLinkToImg(currentVehicle.getLinkToImg());
        updatingVehicle.setCreatedAt(currentVehicle.getCreatedAt());
        updatingVehicle.setComment(currentVehicle.getComment());

        vehicleRepository.save(updatingVehicle);
    }
}
