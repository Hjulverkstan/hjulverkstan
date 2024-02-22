package se.hjulverkstan.main.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.Exceptions.VehicleNotFoundException;
import se.hjulverkstan.main.model.Vehicle;
import se.hjulverkstan.main.service.VehicleService;

import java.util.List;

@RestController
@RequestMapping("/vehicle")
public class VehicleController {
    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping("/")
    public ResponseEntity<String> createVehicle(@RequestBody Vehicle vehicle) {
        vehicleService.createVehicle(vehicle);
        return ResponseEntity.ok("Successfully created a vehicle");
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id) throws VehicleNotFoundException {
        return new ResponseEntity<>(vehicleService.getVehicleById(id), HttpStatus.OK);
    }

    @GetMapping("/")
    public ResponseEntity<List<Vehicle>> getAllVehicles() throws VehicleNotFoundException {
        return new ResponseEntity<>(vehicleService.getAllVehicles(), HttpStatus.OK);
    }

    @PutMapping(("/{id}"))
    public ResponseEntity<Void> updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicle) throws VehicleNotFoundException {
        return new ResponseEntity<>(vehicleService.updateVehicle(id,vehicle),HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public void deleteVehicle(@PathVariable Long id) throws VehicleNotFoundException {
        vehicleService.deleteVehicle(id);
    }
}
