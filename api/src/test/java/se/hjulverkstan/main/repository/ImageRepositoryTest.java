package se.hjulverkstan.main.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertThrows;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;


public class ImageRepositoryTest {

    @Mock
    private EntityManager entityManager;

    @Mock
    private Query query;

    @InjectMocks
    private ImageRepositoryImpl imageRepository;

    private AutoCloseable closeable;

    @BeforeEach
    void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
    }

    @AfterEach
    void tearDown() throws Exception {
        closeable.close();
    }

    @Test
    void deleteSpecificS3URLFromAllEntities_shouldCreateCorrectQueries() {
        // Arrange
        when(entityManager.createNativeQuery(anyString())).thenReturn(query);
        when(query.setParameter(anyString(), any())).thenReturn(query);
        List<String> expectedQueries = List.of(
                "UPDATE vehicle SET imageURL = NULL WHERE imageURL LIKE CONCAT('%', :fileKey)",
                "UPDATE Shop SET imageURL = NULL WHERE imageURL LIKE CONCAT('%', :fileKey)",
                "UPDATE General_Content SET imageURL = NULL WHERE imageURL LIKE CONCAT('%', :fileKey)"
        );

        // Act
        imageRepository.deleteSpecificS3URLFromAllEntities("test-file-key");

        // Assert
        ArgumentCaptor<String> queryCaptor = ArgumentCaptor.forClass(String.class);
        verify(entityManager, times(3)).createNativeQuery(queryCaptor.capture());
        verify(query, times(3)).setParameter("fileKey", "test-file-key");
        verify(query, times(3)).executeUpdate();

        List<String> actualQueries = queryCaptor.getAllValues();
        assertThat(actualQueries).containsExactlyElementsOf(expectedQueries);

        verifyNoMoreInteractions(entityManager, query);
    }

    /*@Test
    void deleteSpecificS3URLFromAllEntities_withBlankFileKey_shouldDoNothing() {
        NullPointerException exception = assertThrows(
                NullPointerException.class, () -> imageRepository.deleteSpecificS3URLFromAllEntities("")
        );
        assertEquals("File key cannot be null", exception.getMessage());
    }

    @Test
    void deleteSpecificS3URLFromAllEntities_withNullFileKey_shouldThrowException() {
        NullPointerException exception = assertThrows(
                NullPointerException.class, () -> imageRepository.deleteSpecificS3URLFromAllEntities(null)
        );
        assertEquals("File key cannot be null", exception.getMessage());
    }*/

    @Test
    void getAllUsedS3URLs_shouldRunCorrectlyForAllTables() {
        // Arrange
        List<String> expectedUrls = List.of("url1", "url2");
        String expectedQuery =
                "SELECT imageURL FROM vehicle WHERE imageURL IS NOT NULL " +
                        "UNION SELECT imageURL FROM Shop WHERE imageURL IS NOT NULL " +
                        "UNION SELECT imageURL FROM General_Content WHERE imageURL IS NOT NULL";
        when(entityManager.createNativeQuery(anyString())).thenReturn(query);
        when(query.getResultList()).thenReturn(expectedUrls);

        // Act
        List<String> actualUrls = imageRepository.getAllUsedS3URLs();

        // Assert
        ArgumentCaptor<String> queryCaptor = ArgumentCaptor.forClass(String.class);
        verify(entityManager).createNativeQuery(queryCaptor.capture());
        verify(query).getResultList();
        assertThat(actualUrls).containsExactlyElementsOf(expectedUrls);

        String actualQuery = queryCaptor.getValue();
        assertEquals(expectedQuery, actualQuery);

        verifyNoMoreInteractions(entityManager, query);
    }

}
