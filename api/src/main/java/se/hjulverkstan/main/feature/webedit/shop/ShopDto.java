package se.hjulverkstan.main.feature.webedit.shop;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.shared.auditable.AuditableDto;

@Data
@NoArgsConstructor
public class ShopDto extends AuditableDto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
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

    private boolean hasTemporaryHours;

    @NotNull(message = "Location id is required to link shop to a location")
    @JsonSerialize(using = ToStringSerializer.class)
    private Long locationId;

    @NotBlank(message = "Body text in at least one language is required for creating a shop")
    private String bodyText;

    public ShopDto (Shop shop, String bodyTextLocalised) {
        super(shop);

        name = shop.getName();
        address = shop.getAddress();
        latitude = shop.getLatitude();
        longitude = shop.getLongitude();
        locationId = shop.getLocation().getId();
        imageURL = shop.getImageURL();
        slug = shop.getSlug();
        hasTemporaryHours = shop.isHasTemporaryHours();

        openHours = new OpenHoursDto(shop.getOpenHours());
        bodyText = bodyTextLocalised;
    }

    // Relations set inside instead of in service layer unlike in other entities in this code base, deemed fine because
    // of simple relation on no possible race conditions. LocalisedContent however should be set in service layer.
    public Shop applyToEntity (Shop shop) {
        shop.setAddress(address);
        shop.setLatitude(latitude);
        shop.setLongitude(longitude);
        shop.setImageURL(imageURL);
        shop.setSlug(slug);
        shop.setHasTemporaryHours(hasTemporaryHours);

        OpenHours openHours = shop.getOpenHours();
        shop.setOpenHours(this.openHours.applyToEntity(openHours == null ? new OpenHours() : openHours));

        return shop;
    }
}
