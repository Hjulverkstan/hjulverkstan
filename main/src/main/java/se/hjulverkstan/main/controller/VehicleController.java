package se.hjulverkstan.main.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.main.dto.vehicles.VehicleDto;
import se.hjulverkstan.main.dto.responses.*;
import se.hjulverkstan.main.dto.vehicles.NewVehicleBikeDto;
import se.hjulverkstan.main.dto.vehicles.VehicleBikeDto;
import se.hjulverkstan.main.service.VehicleService;

@RestController
@RequestMapping("/vehicle")
public class VehicleController {
    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping("/bike")
    public ResponseEntity<VehicleDto> createVehicle(@RequestBody NewVehicleBikeDto vehicle) {
        return new ResponseEntity<>(vehicleService.createVehicle(vehicle), HttpStatus.OK);
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
    public ResponseEntity<VehicleDto> editVehicle(@PathVariable Long id, @RequestBody VehicleBikeDto vehicle) {
        return new ResponseEntity<>(vehicleService.editVehicle(id, vehicle), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<VehicleDto> deleteVehicle(@PathVariable Long id) {
        return new ResponseEntity<>(vehicleService.deleteVehicle(id), HttpStatus.OK);
    }
}