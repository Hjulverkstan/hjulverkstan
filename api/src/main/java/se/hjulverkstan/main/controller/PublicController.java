package se.hjulverkstan.main.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.main.dto.responses.GetAllVehicleDto;
import se.hjulverkstan.main.dto.vehicles.VehicleDto;
import se.hjulverkstan.main.service.VehicleService;

@RestController
@RequestMapping("v1/api/public")
public class PublicController {
    private final VehicleService vehicleService;

    public PublicController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping("/vehicle")
    public ResponseEntity<GetAllVehicleDto> getAllPublicVehicles(@RequestParam(required = false) Long locationId) {
        if (locationId != null) {
            return new ResponseEntity<>(vehicleService.getAllPublicVehiclesByLocationId(locationId), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(vehicleService.getAllPublicVehicles(), HttpStatus.OK);
        }
    }

    @GetMapping("/vehicle/{id}")
    public ResponseEntity<VehicleDto> getPublicVehicleById(@PathVariable Long id) {
        return new ResponseEntity<>(vehicleService.getPublicVehicleById(id), HttpStatus.OK);
    }
}