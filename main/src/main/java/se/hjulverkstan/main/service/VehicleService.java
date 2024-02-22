package se.hjulverkstan.main.service;

import se.hjulverkstan.Exceptions.VehicleNotFoundException;
import se.hjulverkstan.main.model.Vehicle;

import java.util.List;

public interface VehicleService {

    public void createVehicle(Vehicle vehicle);

    public List<Vehicle> getAllVehicles() throws VehicleNotFoundException;

    public void deleteVehicle(Long id) throws VehicleNotFoundException;

    public Vehicle getVehicleById(Long id) throws VehicleNotFoundException;

    public void updateVehicle(Long id, Vehicle currentVehicle) throws VehicleNotFoundException;
}
