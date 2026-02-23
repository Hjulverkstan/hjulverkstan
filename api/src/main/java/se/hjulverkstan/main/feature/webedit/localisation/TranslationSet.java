package se.hjulverkstan.main.feature.webedit.localisation;

import jakarta.persistence.*;
import lombok.*;
import se.hjulverkstan.main.feature.webedit.releases.Releasable;
import se.hjulverkstan.main.feature.webedit.releases.ReleaseStatus;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(
        name = "translation_set",
        indexes = {
                @Index(name = "ix_translation_set_identity_lang", columnList = "identity_id, lang"),
                @Index(name = "ix_translation_set_release", columnList = "release_id, release_status")
        }
)
public class TranslationSet extends Releasable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Language lang;

    @OneToMany(mappedBy = "translationSet", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LocalisedContent> entries = new ArrayList<>();

    public TranslationSet (Language lang, UUID identityId) {
        super();

        setIdentityId(identityId);
        setLang(lang);
        setReleaseId(null);
        setReleaseStatus(ReleaseStatus.DRAFT);
    }
}