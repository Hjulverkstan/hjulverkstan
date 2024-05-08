package se.hjulverkstan.main.model.webedit;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import se.hjulverkstan.main.model.base.Auditable;

import java.util.List;

@Entity
@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
public class GeneralContent extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "text_type")
    private TextType textType;
    private String name;
    private String description;

    private String key;

    @OneToMany(mappedBy = "generalContent")
    private List<LocalisedContent> localisedContent;
}
