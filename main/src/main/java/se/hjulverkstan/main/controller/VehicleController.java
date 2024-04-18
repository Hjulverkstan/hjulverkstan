package se.hjulverkstan.main.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.main.dto.vehicles.*;
import se.hjulverkstan.main.dto.responses.*;
import se.hjulverkstan.main.model.BatchGroup;
import se.hjulverkstan.main.model.SingleVehicleGroup;
import se.hjulverkstan.main.service.VehicleService;

@RestController
@RequestMapping("v1/vehicle")
public class VehicleController {
    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping()
    public ResponseEntity<VehicleDto> createGeneric(@Validated(SingleVehicleGroup.class) @RequestBody NewVehicleGenericDto newVehicleGenericDto) {
        return new ResponseEntity<>(vehicleService.createVehicle(newVehicleGenericDto), HttpStatus.OK);
    }

    @PostMapping("/batch")
    public ResponseEntity<VehicleDto> createBatch(@Validated(BatchGroup.class) @RequestBody NewVehiclebatchDto newVehiclebatchDto) {
        return new ResponseEntity<>(vehicleService.createVehicle(newVehiclebatchDto), HttpStatus.OK);
    }

    @PostMapping("/bike")
    public ResponseEntity<VehicleDto> createBike(@Validated(SingleVehicleGroup.class) @RequestBody NewVehicleBikeDto newVehicleBikeDto) {
        return new ResponseEntity<>(vehicleService.createVehicle(newVehicleBikeDto), HttpStatus.OK);
    }

    @PostMapping("/stroller")
    public ResponseEntity<VehicleDto> createStroller(@Validated(SingleVehicleGroup.class) @RequestBody NewVehicleStrollerDto newStrollerDto) {
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
    public ResponseEntity<VehicleDto> editGeneric(@PathVariable Long id, @Validated(SingleVehicleGroup.class) @RequestBody VehicleGenericDto vehicleGenericDto) {
        return new ResponseEntity<>(vehicleService.editVehicle(id, vehicleGenericDto), HttpStatus.OK);
    }

    @PutMapping(("/batch/{id}"))
    public ResponseEntity<VehicleDto> editBatch(@PathVariable Long id, @Validated(BatchGroup.class) @RequestBody VehicleBatchDto vehicleBatchDto) {
        return new ResponseEntity<>(vehicleService.editVehicle(id, vehicleBatchDto), HttpStatus.OK);
    }

    @PutMapping(("/bike/{id}"))
    public ResponseEntity<VehicleDto> editBike(@PathVariable Long id, @Validated(SingleVehicleGroup.class) @RequestBody VehicleBikeDto vehicleBikeDto) {
        return new ResponseEntity<>(vehicleService.editVehicle(id, vehicleBikeDto), HttpStatus.OK);
    }

    @PutMapping(("/stroller/{id}"))
    public ResponseEntity<VehicleDto> editStroller(@PathVariable Long id, @Validated(SingleVehicleGroup.class) @RequestBody VehicleStrollerDto vehicleStrollerDto) {
        return new ResponseEntity<>(vehicleService.editVehicle(id, vehicleStrollerDto), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<VehicleDto> deleteVehicle(@PathVariable Long id) {
        return new ResponseEntity<>(vehicleService.deleteVehicle(id), HttpStatus.OK);
    }
}