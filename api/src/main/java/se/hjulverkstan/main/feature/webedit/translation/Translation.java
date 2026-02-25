package se.hjulverkstan.main.feature.webedit.translation;

import jakarta.persistence.*;
import lombok.*;
import se.hjulverkstan.main.shared.auditable.Auditable;

@Entity
@Getter
@Setter
@ToString(exclude = {"translationSet"})
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Table(
        name = "translation",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"translation_set_id", "field_name"})
        },
        indexes = {
                @Index(name = "ix_localised_content_set", columnList = "translation_set_id")
        }
)
public class Translation extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "translation_set_id", nullable = false)
    private TranslationSet translationSet;

    @Enumerated(EnumType.STRING)
    private FieldType fieldType;

    @Enumerated(EnumType.STRING)
    @Column(name = "field_name", nullable = false)
    private FieldName fieldName;

    @Column(columnDefinition = "TEXT")
    private String content;
}