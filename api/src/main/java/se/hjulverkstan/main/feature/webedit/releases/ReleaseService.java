package se.hjulverkstan.main.feature.webedit.releases;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.feature.webedit.WebEditEntity;
import se.hjulverkstan.main.feature.webedit.localisation.Language;
import se.hjulverkstan.main.feature.webedit.localisation.TranslationSet;
import se.hjulverkstan.main.feature.webedit.localisation.TranslationSetRepository;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReleaseService {

    private final IdentityRepository identityRepository;
    private final TranslationSetRepository translationSetRepository;
    private final EntityManager em;

    /**
     * Returns the active TranslationSet for editing (draft/queued, release_id null).
     * Creates a draft set if missing.
     *
     * Policy: if it's QUEUED and user edits, it becomes DRAFT again.
     */
    @Transactional
    public TranslationSet getOrCreateActiveTranslationSet(UUID identityId, Language lang) {
        TranslationSet set = translationSetRepository
                .findFirstByIdentityIdAndLangAndReleaseIdIsNull(identityId, lang)
                .orElse(null);

        if (set == null) {
            set = new TranslationSet(lang, identityId); // Has status DRAFT
            return translationSetRepository.save(set);
        }

        // If it is queued, any edit should bump it back to draft.
        if (set.getReleaseStatus() == ReleaseStatus.QUEUED) {
            set.setReleaseStatus(ReleaseStatus.DRAFT);
            return translationSetRepository.save(set);
        }

        return set;
    }

    /**
     * For reads in a language view:
     * Prefer active (draft/queued), otherwise latest published.
     */
    @Transactional(readOnly = true)
    public TranslationSet findBestTranslationSetForRead(UUID identityId, Language lang) {
        TranslationSet active = translationSetRepository
                .findFirstByIdentityIdAndLangAndReleaseIdIsNull(identityId, lang)
                .orElse(null);

        if (active != null) return active;

        return translationSetRepository
                .findFirstByIdentityIdAndLangAndReleaseStatusOrderByReleaseIdDesc(identityId, lang, ReleaseStatus.PUBLISHED)
                .orElse(null);
    }

    @Transactional
    public void queueTranslationSet(UUID identityId, Language lang) {
        TranslationSet set = translationSetRepository
                .findFirstByIdentityIdAndLangAndReleaseIdIsNull(identityId, lang)
                .orElseThrow(() -> new IllegalStateException("No active translation set to queue for " + identityId + " " + lang));

        set.setReleaseStatus(ReleaseStatus.QUEUED);
        translationSetRepository.save(set);
    }

    @Transactional
    public <T extends Releasable> T attachIdentity(WebEditEntity webEditEntity, T entity) {
        Identity identity = new Identity(webEditEntity);
        identity = identityRepository.save(identity);

        entity.setIdentityId(identity.getId());
        return entity;
    }

    @Transactional
    public void deleteTranslationSet(UUID identityId, Language lang) {
        TranslationSet set = translationSetRepository.findFirstByIdentityIdAndLang(identityId, lang)
                .orElseThrow(() -> new ElementNotFoundException("No translations available for deletion"));

        if (set.isNotPublished()) {
            translationSetRepository.delete(set);
        } else {
            set.setDeleted(true);
            translationSetRepository.save(set);
        }
    }

}