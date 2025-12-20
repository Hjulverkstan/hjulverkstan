package se.hjulverkstan.main.feature.webedit.text;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import se.hjulverkstan.main.feature.webedit.localisation.Localised;
import se.hjulverkstan.main.feature.webedit.localisation.LocalisedContent;
import se.hjulverkstan.main.shared.auditable.Auditable;

import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Text extends Auditable implements Localised {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "key", length = 64, nullable = false, unique = true)
    @Convert(converter = TextKeyConverter.class)
    private TextKey key;

    @OneToMany(mappedBy = "text", cascade = {CascadeType.REMOVE, CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true, fetch =  FetchType.EAGER)
    private List<LocalisedContent> localisedContent;
}
