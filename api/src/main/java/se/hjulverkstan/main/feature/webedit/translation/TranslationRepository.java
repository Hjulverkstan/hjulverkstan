package se.hjulverkstan.main.feature.webedit.translation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface TranslationRepository extends JpaRepository<Translation, Long> {

    @Query("""
        select t
        from Translation t
        where t.translationSet.identityId = :identityId
          and t.translationSet.lang = :lang
          and t.fieldName = :fieldName
    """)
    Optional<Translation> findByIdentityIdAndLangAndFieldName(
            @Param("identityId") UUID identityId,
            @Param("lang") Language lang,
            @Param("fieldName") FieldName fieldName
    );
}