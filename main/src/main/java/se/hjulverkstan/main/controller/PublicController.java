package se.hjulverkstan.main.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import se.hjulverkstan.main.dto.responses.GetAllVehicleDto;
import se.hjulverkstan.main.dto.vehicles.VehicleDto;
import se.hjulverkstan.main.service.VehicleService;

@RestController
@RequestMapping("/v1/public")
public class PublicController {
    private final VehicleService vehicleService;

    public PublicController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping("/vehicle")
    public ResponseEntity<GetAllVehicleDto> getAllVehicles() {
        return new ResponseEntity<>(vehicleService.getAllVehicles(), HttpStatus.OK);
    }

    @GetMapping("/vehicle/{id}")
    public ResponseEntity<VehicleDto> getVehicleById(@PathVariable Long id) {
        return new ResponseEntity<>(vehicleService.getVehicleById(id), HttpStatus.OK);
    }
}