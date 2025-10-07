package se.hjulverkstan.main.feature.site;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.main.feature.vehicle.VehicleDto;
import se.hjulverkstan.main.shared.ListResponseDto;

@RestController
@RequestMapping("v1/api/site")
@RequiredArgsConstructor
public class SiteController {
    private final SiteService siteService;

    @GetMapping("/vehicle/location/{locationId}")
    public ListResponseDto<VehicleDto> getAllPublicVehicles(@PathVariable Long locationId) {
        return siteService.findPublicAvailableVehicles(locationId);
    }

    @GetMapping("/vehicle/{id}")
    public VehicleDto getPublicVehicleById(@PathVariable Long id) {
        return siteService.findById(id);
    }
}