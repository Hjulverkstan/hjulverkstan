package se.hjulverkstan.main.feature.webedit.story;

import jakarta.persistence.*;
import lombok.*;
import se.hjulverkstan.main.feature.webedit.localisation.Localised;
import se.hjulverkstan.main.feature.webedit.localisation.LocalisedContent;
import se.hjulverkstan.main.feature.webedit.releases.Releasable;
import se.hjulverkstan.main.shared.auditable.Auditable;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class Story extends Releasable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String slug;
    private String imageURL;

    public Story (Story from) {
        super();
        this.title = from.getTitle();
        this.slug = from.getSlug();
        this.imageURL = from.getImageURL();
    }
}
