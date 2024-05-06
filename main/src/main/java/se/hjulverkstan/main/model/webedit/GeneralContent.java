package se.hjulverkstan.main.model.webedit;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.SQLRestriction;
import se.hjulverkstan.main.model.base.Auditable;

import java.util.Set;

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

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "refId", referencedColumnName = "id")
    @SQLRestriction("ref_type = 'GeneralContent'")
    private Set<LocalisedContent> localisedContent;

}
