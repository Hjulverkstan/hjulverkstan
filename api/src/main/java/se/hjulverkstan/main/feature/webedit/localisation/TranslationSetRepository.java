package se.hjulverkstan.main.feature.webedit.localisation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import se.hjulverkstan.main.feature.webedit.WebEditEntity;
import se.hjulverkstan.main.feature.webedit.releases.ReleaseStatus;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

public interface TranslationSetRepository extends JpaRepository<TranslationSet, Long> {
    Optional<TranslationSet> findFirstByIdentityIdAndLang(UUID identityId, Language lang);
    Optional<TranslationSet> findFirstByIdentityIdAndLangAndReleaseIdIsNull(UUID identityId, Language lang);

    Optional<TranslationSet> findFirstByIdentityIdAndLangAndReleaseStatusOrderByReleaseIdDesc(
            UUID identityId, Language lang, ReleaseStatus status
    );

    @Query("""
    SELECT ts.lang, COUNT(ts)
    FROM TranslationSet ts
    JOIN Identity i ON i.id = ts.identityId
    WHERE i.entity = :entity
    GROUP BY ts.lang
    """)
    Optional<List<Object[]>> countLangByEntity(@Param("entity") WebEditEntity entity);

    @Query("""
    SELECT DISTINCT ts.lang
    FROM TranslationSet ts
    """)
    Optional<Set<Language>> findDistinctLangs();
}