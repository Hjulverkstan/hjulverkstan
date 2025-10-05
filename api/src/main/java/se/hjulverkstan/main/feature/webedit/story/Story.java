package se.hjulverkstan.main.feature.webedit.story;

import jakarta.persistence.*;
import lombok.*;
import se.hjulverkstan.main.feature.webedit.localisation.Localised;
import se.hjulverkstan.main.feature.webedit.localisation.LocalisedContent;
import se.hjulverkstan.main.shared.Auditable;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Story extends Auditable implements Localised {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String bodyText;
    private String imageURL;

    @OneToMany(mappedBy = "story", cascade = {CascadeType.REMOVE, CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<LocalisedContent> localisedContent = new ArrayList<>();
}
