package se.hjulverkstan.main.feature.webedit.shop;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import se.hjulverkstan.main.feature.location.Location;
import se.hjulverkstan.main.feature.webedit.translation.Translatable;
import se.hjulverkstan.main.feature.webedit.translation.Translation;
import se.hjulverkstan.main.shared.auditable.Auditable;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Shop extends Auditable implements Translatable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
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
    private List<Translation> translations = new ArrayList<>();
}
