package se.hjulverkstan.main.repository;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.test.context.jdbc.Sql;
import se.hjulverkstan.main.annotations.RepositoryTest;
import se.hjulverkstan.main.model.Vehicle;
import se.hjulverkstan.main.model.webedit.GeneralContent;
import se.hjulverkstan.main.model.webedit.Shop;
import se.hjulverkstan.main.repository.webedit.GeneralContentRepository;
import se.hjulverkstan.main.repository.webedit.ShopRepository;

import java.util.Collection;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Stream;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;

@Slf4j
@Sql(
        scripts = {
                "classpath:script/location.sql",
                "classpath:script/open_hours.sql",
                "classpath:script/shop.sql",
                "classpath:script/vehicle.sql",
                "classpath:script/general_content.sql"
        })
@RepositoryTest
@Import(ImageRepositoryImpl.class)
public class ImageRepositoryIT {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private GeneralContentRepository generalContentRepository;

    private static final String FILE_KEY_ONE = "image_url_1.jpg";
    private static final String FILE_KEY_TWO = "image_url_2.jpg";
    private static final String FILE_KEY_THREE = "image_url_3.jpg";
    public static final String EMPTY_STRING = "";
    public static final String SPECIAL_CHARS = "image @#%_url$.jpg";
    public static final String SUBSTRING = "image_url_123.jpg";
    public static final String WHITESPACE = "   ";
    public static final String SQL_WILDCARD = "image_url_%.jpg";

    private static final String FILE_KEY_NOT_IN_DATA_BASE = "image_url_4.jpg";

    private static final List<String> IMAGE_URLS = List.of(
            FILE_KEY_ONE,
            FILE_KEY_TWO,
            FILE_KEY_THREE,
            EMPTY_STRING,
            SPECIAL_CHARS,
            SUBSTRING,
            WHITESPACE,
            SQL_WILDCARD
    );

    @Test
    @DisplayName("Should get all valid URLs from all tables")
    void getAllValidUrls() {
        // Act
        List<String> result = imageRepository.getAllUsedS3URLs();

        // Assert
        assertThat(result)
                .isNotEmpty()
                .hasSize(IMAGE_URLS.size())
                .containsExactlyInAnyOrderElementsOf(IMAGE_URLS);
    }

    @Test
    @DisplayName("Should delete specific URL from Vehicle table")
    void deleteSpecificS3URL_shouldDeleteFromVehicle() {
        // Precheck
        assertThat(getAllVehiclesUrls()).contains(FILE_KEY_ONE);

        // Act
        imageRepository.deleteSpecificS3URLFromAllEntities(FILE_KEY_ONE);

        // Assert
        assertThat(getAllVehiclesUrls()).doesNotContain(FILE_KEY_ONE);
    }

    @Test
    void deleteSpecificS3URL_shouldNotAffectRows_WhenNoImageURLMatchesFileKey() {
        // Precheck
        assertThat(getAllVehiclesUrls()).contains(FILE_KEY_ONE);

        // Act
        imageRepository.deleteSpecificS3URLFromAllEntities(FILE_KEY_NOT_IN_DATA_BASE);

        // Assert
        assertThat(getAllVehiclesUrls()).contains(FILE_KEY_ONE);
    }

    @Test
    void deleteSpecificS3URL_shouldUpdateMultipleEntities_WhenFileKeyAppearsInMultipleTables() {
        // Precheck
        assertThat(getAllVehiclesUrls()).contains(FILE_KEY_ONE);
        assertThat(getAllShopsUrls()).contains(FILE_KEY_ONE);
        assertThat(getAllGeneralContentUrls()).contains(FILE_KEY_ONE);

        // Act
        imageRepository.deleteSpecificS3URLFromAllEntities(FILE_KEY_ONE);

        // Assert
        assertThat(getAllVehiclesUrls()).doesNotContain(FILE_KEY_ONE);
        assertThat(getAllShopsUrls()).doesNotContain(FILE_KEY_ONE);
        assertThat(getAllGeneralContentUrls()).doesNotContain(FILE_KEY_ONE);
    }

    @Test
    void deleteSpecificS3URL_shouldNotUpdateOtherRow_whereFilekeyDoesNotMatch() {
        // Precheck
        assertThat(getAllVehiclesUrls()).contains(FILE_KEY_ONE);
        assertThat(getAllVehiclesUrls()).contains(FILE_KEY_TWO);
        assertThat(getAllVehiclesUrls()).contains(FILE_KEY_THREE);

        // Act
        imageRepository.deleteSpecificS3URLFromAllEntities(FILE_KEY_ONE);

        // Assert
        assertThat(getAllVehiclesUrls()).doesNotContain(FILE_KEY_ONE);
        assertThat(getAllVehiclesUrls()).contains(FILE_KEY_TWO);
        assertThat(getAllVehiclesUrls()).contains(FILE_KEY_THREE);
    }

    @Test
    @DisplayName("Should not delete if case does not match (case sensitivity test)")
    void deleteSpecificS3URL_shouldBeCaseSensitive() {
        String upperCaseFileKey = FILE_KEY_ONE.toUpperCase();
        // Precheck
        assertThat(getAllVehiclesUrls()).contains(FILE_KEY_ONE);

        // Act
        imageRepository.deleteSpecificS3URLFromAllEntities(upperCaseFileKey);

        // Assert
        assertThat(getAllVehiclesUrls()).contains(FILE_KEY_ONE);
    }

    @Test
    @DisplayName("Should not delete URLs that only partially match the file key")
    void deleteSpecificS3URL_shouldNotDeletePartialMatches() {
        String partialFileKey = "url_1.jpg"; // substring of FILE_KEY_ONE
        // Precheck
        assertThat(getAllVehiclesUrls()).contains(FILE_KEY_ONE);

        // Act
        imageRepository.deleteSpecificS3URLFromAllEntities(partialFileKey);

        // Assert
        assertThat(getAllVehiclesUrls()).contains(FILE_KEY_ONE);
    }

    @Test
    @DisplayName("Should not delete when imageURL is an empty string")
    void deleteSpecificS3URL_shouldNotDeleteWhenImageUrlIsEmptyString() {
        String emptyString = "";

        // Precheck
        assertThat(getAllVehiclesUrls()).contains(emptyString);

        // Act
        imageRepository.deleteSpecificS3URLFromAllEntities(emptyString);

        // Assert
        assertThat(getAllVehiclesUrls()).doesNotContain(emptyString);
    }

    @Test
    @DisplayName("Should handle imageURL with special characters")
    void deleteSpecificS3URL_shouldDeleteWithSpecialCharacters() {
        String specialUrl = "image @#%_url$.jpg";

        // Precheck
        assertThat(getAllVehiclesUrls()).contains(specialUrl);

        // Act
        imageRepository.deleteSpecificS3URLFromAllEntities(specialUrl);

        // Assert
        assertThat(getAllVehiclesUrls()).doesNotContain(specialUrl);
    }

    @Test
    @DisplayName("Should not delete when imageURL is a substring of another URL")
    void deleteSpecificS3URL_shouldNotDeleteWhenFileKeyIsSubstring() {
        String fullUrl = "image_url_123.jpg";
        String substring = "image_url_12.jpg";
        assertThat(getAllVehiclesUrls()).contains(substring);
        assertThat(getAllVehiclesUrls()).contains(fullUrl);

        // Act
        imageRepository.deleteSpecificS3URLFromAllEntities(substring);

        // Assert
        assertThat(getAllVehiclesUrls()).doesNotContain(substring);
        assertThat(getAllVehiclesUrls()).contains(fullUrl);
    }

    @Test
    @DisplayName("Should not delete when fileKey is only whitespace")
    void deleteSpecificS3URL_shouldNotDeleteWhenFileKeyIsWhitespace() {
        String whitespaceKey = "   ";
        // Precheck
        assertThat(getAllVehiclesUrls()).contains(FILE_KEY_ONE);

        // Act
        imageRepository.deleteSpecificS3URLFromAllEntities(whitespaceKey);

        // Assert
        assertThat(getAllVehiclesUrls()).contains(FILE_KEY_ONE);
    }

    @Test
    @DisplayName("Should not throw or delete when fileKey is very long")
    void deleteSpecificS3URL_shouldNotDeleteWhenFileKeyIsVeryLong() {
        String veryLongKey = "a".repeat(500);
        // Precheck
        assertThat(getAllVehiclesUrls()).contains(FILE_KEY_ONE);

        // Act
        imageRepository.deleteSpecificS3URLFromAllEntities(veryLongKey);

        // Assert
        assertThat(getAllVehiclesUrls()).contains(FILE_KEY_ONE);
    }

    @Test
    @DisplayName("Should treat SQL wildcards in fileKey as literals")
    void deleteSpecificS3URL_shouldTreatWildcardsAsLiterals() {
        String wildcardKey = "image_url_%.jpg";

        // Precheck
        assertThat(getAllVehiclesUrls()).contains(wildcardKey);

        // Act
        imageRepository.deleteSpecificS3URLFromAllEntities(wildcardKey);

        // Assert
        assertThat(getAllVehiclesUrls()).doesNotContain(wildcardKey);
    }

    /**
     * This method retrieves all image URLs from the specified repositories and flattens them into a single list.
     *
     * @return A list of all image URLs from the repositories.
     */
    private List<String> getAllUrlsSeparatelyFromEachRepository() {
        return Stream.of(
                        getImageUrlsFromRepository(vehicleRepository, Vehicle::getImageURL),
                        getImageUrlsFromRepository(shopRepository, Shop::getImageURL),
                        getImageUrlsFromRepository(generalContentRepository, GeneralContent::getImageURL)
                ).flatMap(Collection::stream)
                .toList();
    }

    /**
     * This method retrieves all distinct nonnull and nonempty image URLs from the specified repository.
     *
     * @param repository         The repository to retrieve image URLs from.
     * @param imageUrlExtractor  A function to extract the image URL from the entity.
     * @param <T>               The type of the entity in the repository.
     * @return A list of nonnull and nonempty image URLs.
     */
    private <T> List<String> getImageUrlsFromRepository(JpaRepository<T, Long> repository, Function<T, String> imageUrlExtractor) {
        return repository.findAll().stream()
                .map(imageUrlExtractor)
                .filter(url -> url != null && !url.isEmpty())
                .distinct()
                .toList();
    }

    /**
     * This method retrieves all image URLs from the Vehicle table.
     *
     * @return A list of image URLs from the Vehicle table.
     */
    private List<String> getAllVehiclesUrls() {
        return entityManager.getEntityManager()
                .createQuery("SELECT v.imageURL FROM Vehicle v", String.class)
                .getResultList();
    }

    /**
     * This method retrieves all image URLs from the Shop table.
     *
     * @return A list of image URLs from the Shop table.
     */
    private List<String> getAllShopsUrls() {
        return entityManager.getEntityManager()
                .createQuery("SELECT s.imageURL FROM Shop s", String.class)
                .getResultList();
    }

    /**
     * This method retrieves all image URLs from the GeneralContent table.
     *
     * @return A list of image URLs from the GeneralContent table.
     */
    private List<String> getAllGeneralContentUrls() {
        return entityManager.getEntityManager()
                .createQuery("SELECT g.imageURL FROM GeneralContent g", String.class)
                .getResultList();
    }

}

