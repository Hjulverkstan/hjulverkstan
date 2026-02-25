package se.hjulverkstan.main.feature.webedit.translation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface TranslationRepository extends JpaRepository<Translation, Long> {

    @Query("SELECT lc.lang, COUNT(lc) FROM Translation lc WHERE lc.text IS NOT NULL GROUP BY lc.lang")
    Optional<List<Object[]>> countLangBytext();

    @Query("SELECT lc.lang, COUNT(lc) FROM Translation lc WHERE lc.shop IS NOT NULL GROUP BY lc.lang")
    Optional<List<Object[]>> countLangByShop();

    @Query("SELECT lc.lang, COUNT(lc) FROM Translation lc WHERE lc.story IS NOT NULL GROUP BY lc.lang")
    Optional<List<Object[]>> countLangByStory();

    @Query("SELECT DISTINCT lc.lang FROM Translation lc")
    Optional<Set<Language>> findDistinctLangs();
}