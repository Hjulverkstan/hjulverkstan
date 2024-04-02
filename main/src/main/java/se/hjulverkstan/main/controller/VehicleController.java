package se.hjulverkstan.main.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.main.dto.vehicles.*;
import se.hjulverkstan.main.dto.responses.*;
import se.hjulverkstan.main.service.VehicleService;

@RestController
@RequestMapping("v1/vehicle")
public class VehicleController {
    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping("/bike")
    public ResponseEntity<VehicleDto> createBike(@Valid @RequestBody NewVehicleBikeDto newVehicleBikeDto) {
        return new ResponseEntity<>(vehicleService.createVehicle(newVehicleBikeDto), HttpStatus.OK);
    }

    @PostMapping("/stroller")
    public ResponseEntity<VehicleDto> createStroller(@Valid @RequestBody NewVehicleStrollerDto newStrollerDto) {
        return new ResponseEntity<>(vehicleService.createVehicle(newStrollerDto), HttpStatus.OK);
    }

    @PostMapping("/scooter")
    public ResponseEntity<VehicleDto> createScooter(@Valid @RequestBody NewVehicleScooterDto newScooterDto) {
        return new ResponseEntity<>(vehicleService.createVehicle(newScooterDto), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleDto> getVehicleById(@PathVariable Long id) {
        return new ResponseEntity<>(vehicleService.getVehicleById(id), HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<GetAllVehicleDto> getAllVehicles() {
        return new ResponseEntity<>(vehicleService.getAllVehicles(), HttpStatus.OK);
    }

    @PutMapping(("/bike/{id}"))
    public ResponseEntity<VehicleDto> editBike(@PathVariable Long id, @Valid @RequestBody VehicleBikeDto vehicleBikeDto) {
        return new ResponseEntity<>(vehicleService.editVehicle(id, vehicleBikeDto), HttpStatus.OK);
    }

    @PutMapping(("/stroller/{id}"))
    public ResponseEntity<VehicleDto> editStroller(@PathVariable Long id, @Valid @RequestBody VehicleStrollerDto vehicleStrollerDto) {
        return new ResponseEntity<>(vehicleService.editVehicle(id, vehicleStrollerDto), HttpStatus.OK);
    }

    @PutMapping(("/scooter/{id}"))
    public ResponseEntity<VehicleDto> editScooter(@PathVariable Long id, @Valid @RequestBody VehicleScooterDto vehicleScooterDto) {
        return new ResponseEntity<>(vehicleService.editVehicle(id, vehicleScooterDto), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<VehicleDto> deleteVehicle(@PathVariable Long id) {
        return new ResponseEntity<>(vehicleService.deleteVehicle(id), HttpStatus.OK);
    }
}