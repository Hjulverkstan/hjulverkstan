package se.hjulverkstan.main.feature.webedit.story;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.error.exceptions.UnsupportedArgumentException;
import se.hjulverkstan.main.feature.webedit.WebEditEntity;
import se.hjulverkstan.main.feature.webedit.release.Identity;
import se.hjulverkstan.main.feature.webedit.release.IdentityRepository;
import se.hjulverkstan.main.feature.webedit.translation.FieldName;
import se.hjulverkstan.main.feature.webedit.translation.Language;
import se.hjulverkstan.main.feature.webedit.translation.TranslationService;
import se.hjulverkstan.main.shared.ListResponseDto;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StoryServiceTest {

    @Mock
    private StoryRepository storyRepository;
    @Mock
    private IdentityRepository identityRepository;
    @Mock
    private TranslationService translationService;

    @InjectMocks
    private StoryService storyService;

    private JsonNode mockJson;
    private static final UUID IDENTITY_ID = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        mockJson = new ObjectMapper().createObjectNode();
    }

    @Test
    @DisplayName("Retrieval: Should return all stories mapped to DTO for specific language")
    void shouldReturnAllStories() {
        // Arrange
        Story story = new Story();
        story.setId(1L);
        story.setIdentityId(IDENTITY_ID);
        story.setCreatedAt(java.time.LocalDateTime.now());
        story.setUpdatedAt(java.time.LocalDateTime.now());
        story.setCreatedBy(1L);
        story.setUpdatedBy(1L);
        when(storyRepository.findAllByDeletedFalse(any(Sort.class))).thenReturn(List.of(story));
        when(translationService.getText(IDENTITY_ID, FieldName.TITLE, Language.SV, false)).thenReturn("Titeln");
        when(translationService.getRichText(IDENTITY_ID, FieldName.BODY_TEXT, Language.SV, false)).thenReturn(mockJson);

        // Act
        ListResponseDto<StoryDto> response = storyService.getAllStoriesByLang(Language.SV);

        // Assert
        assertEquals(1, response.getContent().size());
        assertEquals("Titeln", response.getContent().getFirst().getTitle());
        verify(storyRepository).findAllByDeletedFalse(argThat((Sort sort) -> {
            Sort.Order order = sort.getOrderFor("createdAt");
            return order != null && order.isDescending();
        }));
    }

    @Test
    @DisplayName("Retrieval: Should throw ElementNotFoundException when story is missing")
    void shouldThrowNotFound_whenMissing() {
        when(storyRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ElementNotFoundException.class, () -> storyService.getStoryByLangAndId(1L, Language.SV));
    }

    @Test
    @DisplayName("Retrieval: Should return story by ID and language")
    void shouldReturnStoryById() {
        // Arrange
        Story story = new Story();
        story.setId(1L);
        story.setIdentityId(IDENTITY_ID);
        story.setCreatedAt(java.time.LocalDateTime.now());
        story.setUpdatedAt(java.time.LocalDateTime.now());
        story.setCreatedBy(1L);
        story.setUpdatedBy(1L);
        when(storyRepository.findById(1L)).thenReturn(Optional.of(story));
        when(translationService.getText(IDENTITY_ID, FieldName.TITLE, Language.SV, false)).thenReturn("Titeln");

        // Act
        StoryDto result = storyService.getStoryByLangAndId(1L, Language.SV);

        // Assert
        assertNotNull(result);
        assertEquals("Titeln", result.getTitle());
    }

    @Test
    @DisplayName("Creation: Should create identity and story in default language (SV)")
    void shouldCreateStory_inDefaultLang() {
        // Arrange
        StoryDto dto = new StoryDto();
        dto.setTitle("Ny story");
        dto.setBodyText(mockJson);
        dto.setSlug("ny-story");

        Identity savedIdentity = new Identity(IDENTITY_ID, WebEditEntity.STORY);
        when(identityRepository.save(any(Identity.class))).thenReturn(savedIdentity);
        when(storyRepository.save(any(Story.class))).thenAnswer(invocation -> {
            Story s = invocation.getArgument(0);
            s.setCreatedAt(java.time.LocalDateTime.now());
            s.setUpdatedAt(java.time.LocalDateTime.now());
            s.setCreatedBy(1L);
            s.setUpdatedBy(1L);
            return s;
        });

        // Act
        StoryDto result = storyService.createStoryByLang(dto, Language.SV);

        // Assert
        assertNotNull(result);
        assertNotNull(result.getCreatedBy());
        
        // Verify Identity creation
        ArgumentCaptor<Identity> identityCaptor = ArgumentCaptor.forClass(Identity.class);
        verify(identityRepository).save(identityCaptor.capture());
        assertEquals(WebEditEntity.STORY, identityCaptor.getValue().getEntity());

        // Verify Story persistence
        ArgumentCaptor<Story> storyCaptor = ArgumentCaptor.forClass(Story.class);
        verify(storyRepository).save(storyCaptor.capture());
        assertEquals(IDENTITY_ID, storyCaptor.getValue().getIdentityId());
        assertEquals("ny-story", storyCaptor.getValue().getSlug());

        // Verify Translation mapping
        ArgumentCaptor<FieldName> fieldCaptor = ArgumentCaptor.forClass(FieldName.class);
        verify(translationService).upsertText(eq(IDENTITY_ID), eq(Language.SV), eq("Ny story"), fieldCaptor.capture());
        assertEquals(FieldName.TITLE, fieldCaptor.getValue());
        
        verify(translationService).upsertRichText(eq(IDENTITY_ID), eq(Language.SV), eq(mockJson), fieldCaptor.capture());
        assertEquals(FieldName.BODY_TEXT, fieldCaptor.getValue());
    }

    @Test
    @DisplayName("Creation: Should reject creation in non-default language")
    void shouldRejectCreation_inEnglish() {
        StoryDto dto = new StoryDto();
        assertThrows(UnsupportedArgumentException.class, () -> storyService.createStoryByLang(dto, Language.EN));
    }

    @Test
    @DisplayName("Update: Should update story fields and translations")
    void shouldEditStory() {
        // Arrange
        Story story = new Story();
        story.setId(1L);
        story.setIdentityId(IDENTITY_ID);
        when(storyRepository.findById(1L)).thenReturn(Optional.of(story));

        StoryDto dto = new StoryDto();
        dto.setTitle("Uppdaterad");
        dto.setSlug("upd");
        dto.setBodyText(mockJson);

        story.setCreatedAt(java.time.LocalDateTime.now());
        story.setUpdatedAt(java.time.LocalDateTime.now());
        story.setCreatedBy(1L);
        story.setUpdatedBy(1L);

        // Act
        storyService.editStoryByLang(1L, dto, Language.SV);

        // Assert
        verify(storyRepository).save(story);
        assertEquals("upd", story.getSlug());
        verify(translationService).upsertText(IDENTITY_ID, Language.SV, "Uppdaterad", FieldName.TITLE);
    }

    @Test
    @DisplayName("Update: Should throw ElementNotFoundException when story to edit is missing")
    void shouldThrowNotFound_whenEditingMissingStory() {
        when(storyRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ElementNotFoundException.class, () -> storyService.editStoryByLang(1L, new StoryDto(), Language.SV));
    }

    @Test
    @DisplayName("Deletion: Should only remove translation when deleting non-default language")
    void shouldDelete_NonDefaultTranslation() {
        // Arrange
        Story story = new Story();
        story.setId(1L);
        story.setIdentityId(IDENTITY_ID);
        when(storyRepository.findById(1L)).thenReturn(Optional.of(story));

        // Act
        storyService.hardDeleteStory(1L, Language.EN);

        // Assert
        verify(translationService).removeTranslationsByLang(IDENTITY_ID, Language.EN);
        verify(storyRepository).save(story);
        verify(storyRepository, never()).delete(any());
        verify(identityRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Deletion: Should block deletion of default language if other translations exist")
    void shouldBlockDelete_whenEnExists() {
        // Arrange
        Story story = new Story();
        story.setId(1L);
        story.setIdentityId(IDENTITY_ID);
        when(storyRepository.findById(1L)).thenReturn(Optional.of(story));
        when(translationService.hasNonDefaultLangTranslations(IDENTITY_ID)).thenReturn(true);

        // Act & Assert
        assertThrows(UnsupportedArgumentException.class, () -> storyService.hardDeleteStory(1L, Language.SV));
    }

    @Test
    @DisplayName("Deletion: Should perform full cleanup when deleting default language with no translations")
    void shouldDeleteFullStory_whenNoTranslationsExist() {
        // Arrange
        Story story = new Story();
        story.setId(1L);
        story.setIdentityId(IDENTITY_ID);
        when(storyRepository.findById(1L)).thenReturn(Optional.of(story));
        when(translationService.hasNonDefaultLangTranslations(IDENTITY_ID)).thenReturn(false);
        
        Identity identity = new Identity(IDENTITY_ID, WebEditEntity.STORY);
        when(identityRepository.findById(IDENTITY_ID)).thenReturn(Optional.of(identity));

        // Act
        storyService.hardDeleteStory(1L, Language.SV);

        // Assert
        verify(identityRepository).delete(identity);
        verify(translationService).removeTranslationsByLang(IDENTITY_ID, Language.SV);
        verify(storyRepository).delete(story);
    }

    @Test
    @DisplayName("Deletion: Should throw exception if identity is missing during full cleanup")
    void shouldThrow_whenIdentityMissingInDelete() {
        // Arrange
        Story story = new Story();
        story.setId(1L);
        story.setIdentityId(IDENTITY_ID);
        when(storyRepository.findById(1L)).thenReturn(Optional.of(story));
        when(translationService.hasNonDefaultLangTranslations(IDENTITY_ID)).thenReturn(false);
        when(identityRepository.findById(IDENTITY_ID)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ElementNotFoundException.class, () -> storyService.hardDeleteStory(1L, Language.SV));
    }
}
