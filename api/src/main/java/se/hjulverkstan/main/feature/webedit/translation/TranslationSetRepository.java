package se.hjulverkstan.main.feature.webedit.translation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import se.hjulverkstan.main.feature.webedit.WebEditEntity;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

public interface TranslationSetRepository extends JpaRepository<TranslationSet, Long> {
    Optional<List<TranslationSet>> findAllByIdentityId(UUID identityId);
    Optional<TranslationSet> findFirstByIdentityIdAndLang(UUID identityId, Language lang);

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