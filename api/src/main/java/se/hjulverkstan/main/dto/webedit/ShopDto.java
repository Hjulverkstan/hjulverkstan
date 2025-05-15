package se.hjulverkstan.main.dto.webedit;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShopDto {
    private Long id;

    @NotNull(message = "Shop name is required")
    private String name;

    @NotNull(message = "Shop address is required")
    private String address;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private String imageURL;

    @NotBlank(message = "Slug is required")
    private String slug;

    @NotNull(message = "Must provide at least one day of open hours")
    private OpenHoursDto openHours;

    @NotNull(message = "Must provide if shop has temporary hours or not")
    private Boolean hasTemporaryHours;

    @NotNull(message = "Location id is required to link shop to a location")
    private Long locationId;

    @NotBlank(message = "Body text in at least one language is required for creating a shop")
    private String bodyText;
}
