package se.hjulverkstan.main.repository.webedit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import se.hjulverkstan.main.model.webedit.LocalisedContent;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocalisedContentRepository extends JpaRepository<LocalisedContent, Long> {

    @Query("SELECT lc.lang, COUNT(lc) FROM LocalisedContent lc WHERE lc.generalContent IS NOT NULL GROUP BY lc.lang")
    Optional<List<Object[]>> countLangByGeneralContent();

    @Query("SELECT lc.lang, COUNT(lc) FROM LocalisedContent lc WHERE lc.shop IS NOT NULL GROUP BY lc.lang")
    Optional<List<Object[]>> countLangByShop();
}
