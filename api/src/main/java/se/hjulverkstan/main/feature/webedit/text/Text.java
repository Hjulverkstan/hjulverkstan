package se.hjulverkstan.main.feature.webedit.text;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import se.hjulverkstan.main.feature.webedit.localisation.Localised;
import se.hjulverkstan.main.feature.webedit.localisation.LocalisedContent;
import se.hjulverkstan.main.shared.Auditable;

import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Text extends Auditable implements Localised {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "text_type")
    private TextType textType;
    private String name;
    private String description;

    private String key;
    private String imageURL;

    @OneToMany(mappedBy = "text", cascade = {CascadeType.REMOVE, CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true, fetch =  FetchType.EAGER)
    private List<LocalisedContent> localisedContent;
}
