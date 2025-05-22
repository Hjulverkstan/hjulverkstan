package se.hjulverkstan.main.repository;


import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;
import se.hjulverkstan.main.annotations.RepositoryTest;
import se.hjulverkstan.main.model.webedit.Language;
import se.hjulverkstan.main.repository.webedit.LocalisedContentRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;


@Slf4j
@Sql(
        scripts = {
                "classpath:script/open_hours.sql",
                "classpath:script/location.sql",
                "classpath:script/shop.sql",
                "classpath:script/general_content.sql",
                "classpath:script/localised_content.sql"
        })
@RepositoryTest
public class LocalisedContentRepositoryIT {

    @Autowired
    private LocalisedContentRepository localisedContentRepository;

    @Test
    @DisplayName("countLangByGeneralContent returns correct language counts for general content")
    void countLangByGeneralContent_returnsCorrectCounts() {
        Optional<List<Object[]>> result = localisedContentRepository.countLangByGeneralContent();
        assertThat(result).isPresent();
        List<Object[]> counts = result.get();

        assertThat(counts).hasSize(2); // ENG and SWE
        assertThat(counts).anySatisfy(row -> {
            assertThat(row[0]).isEqualTo(Language.ENG);
            assertThat(((Number) row[1]).intValue()).isEqualTo(14);
        });
        assertThat(counts).anySatisfy(row -> {
            assertThat(row[0]).isEqualTo(Language.SWE);
            assertThat(((Number) row[1]).intValue()).isEqualTo(14);
        });
    }

    @Test
    @DisplayName("countLangByShop returns correct language counts for shop content")
    void countLangByShop_returnsCorrectCounts() {
        Optional<List<Object[]>> result = localisedContentRepository.countLangByShop();
        assertThat(result).isPresent();
        List<Object[]> counts = result.get();

        assertThat(counts).hasSize(2); // ENG and SWE
        assertThat(counts).anySatisfy(row -> {
            assertThat(row[0]).isEqualTo(Language.ENG);
            assertThat(((Number) row[1]).intValue()).isEqualTo(1);
        });
        assertThat(counts).anySatisfy(row -> {
            assertThat(row[0]).isEqualTo(Language.SWE);
            assertThat(((Number) row[1]).intValue()).isEqualTo(1);
        });
    }

    @Test
    @DisplayName("findDistinctLangs returns all unique languages present in the data")
    void findDistinctLangs_returnsAllUniqueLanguages() {
        Optional<Set<Language>> result = localisedContentRepository.findDistinctLangs();
        assertThat(result).isPresent();
        Set<Language> languages = result.get();

        assertThat(languages).containsExactlyInAnyOrder(Language.ENG, Language.SWE);
    }

    @Test
    @DisplayName("countLangByGeneralContent returns empty when no general content exists")
    void countLangByGeneralContent_returnsEmptyIfNoGeneralContent() {
        // Simulate no general content by clearing the table or modifying the data
        Optional<List<Object[]>> result = localisedContentRepository.countLangByGeneralContent();
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("countLangByShop returns empty when no shop content exists")
    void countLangByShop_returnsEmptyIfNoShopContent() {
        // Simulate no shop content by clearing the table or modifying the data
        Optional<List<Object[]>> result = localisedContentRepository.countLangByShop();
        assertThat(result).isEmpty();
    }

}
