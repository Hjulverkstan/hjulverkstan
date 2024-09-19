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

    @PostMapping()
    public ResponseEntity<VehicleDto> createGeneric(@Valid @RequestBody NewVehicleGenericDto newVehicleGenericDto) {
        return new ResponseEntity<>(vehicleService.createVehicle(newVehicleGenericDto), HttpStatus.OK);
    }

    @PostMapping("/batch")
    public ResponseEntity<VehicleDto> createBatch(@Valid @RequestBody NewVehiclebatchDto newVehiclebatchDto) {
        return new ResponseEntity<>(vehicleService.createVehicle(newVehiclebatchDto), HttpStatus.OK);
    }

    @PostMapping("/bike")
    public ResponseEntity<VehicleDto> createBike(@Valid @RequestBody NewVehicleBikeDto newVehicleBikeDto) {
        return new ResponseEntity<>(vehicleService.createVehicle(newVehicleBikeDto), HttpStatus.OK);
    }

    @PostMapping("/stroller")
    public ResponseEntity<VehicleDto> createStroller(@Valid @RequestBody NewVehicleStrollerDto newStrollerDto) {
        return new ResponseEntity<>(vehicleService.createVehicle(newStrollerDto), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleDto> getVehicleById(@PathVariable Long id) {
        return new ResponseEntity<>(vehicleService.getVehicleById(id), HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<GetAllVehicleDto> getAllVehicles() {
        return new ResponseEntity<>(vehicleService.getAllVehicles(), HttpStatus.OK);
    }

    @PutMapping(("/{id}"))
    public ResponseEntity<EditVehicleDto> editGeneric(@PathVariable Long id, @Valid @RequestBody EditVehicleGenericDto vehicleGenericDto) {
        return new ResponseEntity<>(vehicleService.editVehicle(id, vehicleGenericDto), HttpStatus.OK);
    }

    @PutMapping(("/batch/{id}"))
    public ResponseEntity<EditVehicleDto> editBatch(@PathVariable Long id, @Valid @RequestBody EditVehicleBatchDto vehicleBatchDto) {
        return new ResponseEntity<>(vehicleService.editVehicle(id, vehicleBatchDto), HttpStatus.OK);
    }

    @PutMapping(("/bike/{id}"))
    public ResponseEntity<EditVehicleDto> editBike(@PathVariable Long id, @Valid @RequestBody EditVehicleBikeDto vehicleBikeDto) {
        return new ResponseEntity<>(vehicleService.editVehicle(id, vehicleBikeDto), HttpStatus.OK);
    }

    @PutMapping(("/stroller/{id}"))
    public ResponseEntity<EditVehicleDto> editStroller(@PathVariable Long id, @Valid @RequestBody EditVehicleStrollerDto vehicleStrollerDto) {
        return new ResponseEntity<>(vehicleService.editVehicle(id, vehicleStrollerDto), HttpStatus.OK);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<VehicleDto> editVehicleStatus(@PathVariable Long id, @Valid @RequestBody EditVehicleStatusDto newStatus) {
        return new ResponseEntity<>(vehicleService.editVehicleStatus(id, newStatus), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<VehicleDto> deleteVehicle(@PathVariable Long id) {
        return new ResponseEntity<>(vehicleService.deleteVehicle(id), HttpStatus.OK);
    }
}