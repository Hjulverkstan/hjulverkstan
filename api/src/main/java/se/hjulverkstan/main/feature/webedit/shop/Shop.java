package se.hjulverkstan.main.feature.webedit.shop;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import se.hjulverkstan.main.feature.location.Location;
import se.hjulverkstan.main.feature.webedit.localisation.Localised;
import se.hjulverkstan.main.feature.webedit.localisation.LocalisedContent;
import se.hjulverkstan.main.shared.Auditable;

import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Shop extends Auditable implements Localised {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;
    private Double latitude;
    private Double longitude;
    private String imageURL;
    private String slug;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "open_hours_id", referencedColumnName = "id")
    private OpenHours openHours;

    private boolean hasTemporaryHours;

    @OneToOne
    @JoinColumn(name = "location_id", referencedColumnName = "id")
    private Location location;

    @OneToMany(mappedBy = "shop", cascade = {CascadeType.REMOVE, CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true, fetch =  FetchType.EAGER)
    private List<LocalisedContent> localisedContent;
}
