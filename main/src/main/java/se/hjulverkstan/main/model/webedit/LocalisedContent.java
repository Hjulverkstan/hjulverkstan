package se.hjulverkstan.main.model.webedit;

import jakarta.persistence.*;
import lombok.*;
import se.hjulverkstan.main.model.base.Auditable;

@Entity
@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"refType", "refId", "fieldName", "lang"})
})
public class LocalisedContent extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String refType; // Type of the referenced entity (e.g., 'GeneralContent', 'Event')
    private Long refId; // ID of the referenced entity in its respective table
    @Enumerated(EnumType.STRING)
    private Language lang; // We use the ISO 639-2 three letter standard where Swedish = 'swe', English = 'eng'
    @Enumerated(EnumType.STRING)
    private FieldNameType fieldName; // Multi field objects like a shop can have several localised fields
    private String content; // The localised content
}

