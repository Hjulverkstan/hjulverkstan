package se.hjulverkstan.main.feature.site;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import se.hjulverkstan.main.feature.vehicle.VehicleDto;
import se.hjulverkstan.main.shared.ListResponseDto;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SiteControllerTest {

    @Mock
    private SiteService siteService;

    @InjectMocks
    private SiteController siteController;

    @Test
    @DisplayName("getAllPublicVehicles delegates to service with locationId")
    void getAllPublicVehicles_DelegatesToService() {
        ListResponseDto<VehicleDto> expected = new ListResponseDto<>(Collections.emptyList());
        when(siteService.findPublicAvailableVehicles(7L)).thenReturn(expected);

        ListResponseDto<VehicleDto> result = siteController.getAllPublicVehicles(7L);

        assertSame(expected, result);
        verify(siteService).findPublicAvailableVehicles(7L);
    }

    @Test
    @DisplayName("getPublicVehicleById delegates to service with correct id")
    void getPublicVehicleById_DelegatesToService() {
        VehicleDto expected = new VehicleDto();
        when(siteService.findById(3L)).thenReturn(expected);

        VehicleDto result = siteController.getPublicVehicleById(3L);

        assertSame(expected, result);
        verify(siteService).findById(3L);
    }
}
