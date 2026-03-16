package se.hjulverkstan.main.feature.webedit.shop;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.feature.location.Location;
import se.hjulverkstan.main.shared.auditable.AuditableDto;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class ShopDto extends AuditableDto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;

    private String name;

    private String address;

    @JsonSerialize(using = ToStringSerializer.class)
    @NotNull(message = "Latitude is required")
    private Double latitude;

    @JsonSerialize(using = ToStringSerializer.class)
    @NotNull(message = "Longitude is required")
    private Double longitude;

    private String imageURL;

    // Slug is auto-generated from name if not provided
    private String slug;

    private OpenHoursDto openHours;

    private boolean hasTemporaryHours;

    @NotNull(message = "Location id is required to link shop to a location")
    @JsonSerialize(using = ToStringSerializer.class)
    private Long locationId;

    public ShopDto (Shop shop) {
        super(shop);

        id = shop.getId();
        name = shop.getLocation().getName();
        address = shop.getLocation().getAddress();
        latitude = shop.getLatitude();
        longitude = shop.getLongitude();
        locationId = shop.getLocation() != null ? shop.getLocation().getId() : null;
        imageURL = shop.getImageURL();
        slug = shop.getSlug();
        hasTemporaryHours = shop.isHasTemporaryHours();
        openHours = shop.getOpenHours() != null ? new OpenHoursDto(shop.getOpenHours()) : null;
    }

    @JsonIgnore
    public boolean isTemporaryHoursActive() {
        if (hasTemporaryHours) {
            return true;
        }
        return openHours != null;
    }

    // Localized content can't be applied directly and is managed by the service.
    public Shop applyToEntity (Shop shop, Location location) {
        shop.setLatitude(latitude);
        shop.setLongitude(longitude);
        shop.setImageURL(imageURL);
        shop.setSlug(slug);
        shop.setHasTemporaryHours(hasTemporaryHours);
        shop.setLocation(location);

        // Only create/update OpenHours if it has actual content
        if(this.openHours != null && !this.openHours.isEmpty()) {
            OpenHours openHours = shop.getOpenHours();
            if (openHours == null) {
                openHours = new OpenHours();
            }
            shop.setOpenHours(this.openHours.applyToEntity(openHours));
        } else if (this.openHours == null || this.openHours.isEmpty()) {
            // If no hours provided, remove existing OpenHours
            shop.setOpenHours(null);
        }

        return shop;
    }
}
