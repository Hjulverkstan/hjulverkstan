package se.hjulverkstan.main.feature.webedit.translation;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import se.hjulverkstan.main.feature.webedit.release.Releasable;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "translation_set")
public class TranslationSet extends Releasable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Language lang;

    @OneToMany(mappedBy = "translationSet", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Translation> entries = new ArrayList<>();

    public TranslationSet(UUID identityId, Language lang) {
        this.setIdentityId(identityId);
        this.lang = lang;
    }
}