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
        @UniqueConstraint(columnNames = {"general_content_id", "lang", "field_name"}),
        @UniqueConstraint(columnNames = {"shop_id", "lang", "field_name"})
})
public class LocalisedContent extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Language lang; // We use the ISO 639-2 three letter standard where Swedish = 'swe', English = 'eng'
    @Enumerated(EnumType.STRING)
    private FieldNameType fieldName; // Multi field objects like an event can have several localised fields
    private String content; // The localised content

    // Nullable foreign key columns for polymorphic use of this table
    @ManyToOne
    @JoinColumn(name = "general_content_id", referencedColumnName = "id", nullable = true)
    GeneralContent generalContent;

    @ManyToOne
    @JoinColumn(name = "shop_id", referencedColumnName = "id", nullable = true)
    Shop shop;
}

