package se.hjulverkstan.main.feature.vehicle;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("v1/api/vehicle")
@PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
@RequiredArgsConstructor
public class VehicleController {
    private final VehicleService vehicleService;

    @GetMapping()
    public GetAllVehicleDto getAllVehicles() {
        return vehicleService.getAllVehicles();
    }

    @GetMapping("/{id}")
    public VehicleDto getVehicleById(@PathVariable Long id) {
        return vehicleService.getVehicleById(id);
    }

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public VehicleDto createVehicle(@Valid @RequestBody VehicleDto dto) {
        return vehicleService.createVehicle(dto);
    }

    @PutMapping(("/{id}"))
    public VehicleDto editVehicle(@PathVariable Long id, @Valid @RequestBody VehicleDto dto) {
        return vehicleService.editVehicle(id, dto);
    }

    @PutMapping("/{id}/status")
    public VehicleDto editVehicleStatus(@PathVariable Long id, @Valid @RequestBody VehicleStatusDto dto) {
        return vehicleService.editVehicleStatus(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
    }
}