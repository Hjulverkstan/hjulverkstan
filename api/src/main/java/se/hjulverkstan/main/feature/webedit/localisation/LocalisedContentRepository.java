package se.hjulverkstan.main.feature.webedit.localisation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface LocalisedContentRepository extends JpaRepository<LocalisedContent, Long> {

    @Query("SELECT lc.lang, COUNT(lc) FROM LocalisedContent lc WHERE lc.text IS NOT NULL GROUP BY lc.lang")
    Optional<List<Object[]>> countLangBytext();

    @Query("SELECT lc.lang, COUNT(lc) FROM LocalisedContent lc WHERE lc.shop IS NOT NULL GROUP BY lc.lang")
    Optional<List<Object[]>> countLangByShop();

    @Query("SELECT lc.lang, COUNT(lc) FROM LocalisedContent lc WHERE lc.story IS NOT NULL GROUP BY lc.lang")
    Optional<List<Object[]>> countLangByStory();

    @Query("SELECT DISTINCT lc.lang FROM LocalisedContent lc")
    Optional<Set<Language>> findDistinctLangs();
}