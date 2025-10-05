package se.hjulverkstan.main.feature.webedit.localisation;

import jakarta.persistence.*;
import lombok.*;
import se.hjulverkstan.main.feature.webedit.text.Text;
import se.hjulverkstan.main.feature.webedit.shop.Shop;
import se.hjulverkstan.main.shared.Auditable;
import se.hjulverkstan.main.feature.webedit.story.Story;

@Entity
@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"text_id", "lang", "field_name"}),
        @UniqueConstraint(columnNames = {"shop_id", "lang", "field_name"}),
        @UniqueConstraint(columnNames = {"story_id", "lang", "field_name"})
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
    @JoinColumn(name = "text_id", referencedColumnName = "id", nullable = true)
    Text text;

    @ManyToOne
    @JoinColumn(name = "shop_id", referencedColumnName = "id", nullable = true)
    Shop shop;

    @ManyToOne
    @JoinColumn(name = "story_id", referencedColumnName = "id", nullable = true)
    Story story;
}

