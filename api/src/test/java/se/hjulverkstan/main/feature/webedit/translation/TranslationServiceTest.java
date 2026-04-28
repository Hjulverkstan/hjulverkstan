package se.hjulverkstan.main.feature.webedit.translation;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.TextNode;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.error.exceptions.InternalServerErrorException;
import se.hjulverkstan.main.shared.AppConstants;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TranslationServiceTest {

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private TranslationSetRepository translationSetRepository;

    @Mock
    private TranslationRepository translationRepository;

    @InjectMocks
    private TranslationService translationService;

    private final UUID identityId = UUID.randomUUID();
    private final FieldName field = FieldName.TITLE;
    private final Language langEn = Language.EN;
    private final Language langSv = AppConstants.DEFAULT_LANGUAGE;

    @Test
    @DisplayName("Should return primary translation when it exists (Fallback ON)")
    void shouldReturnPrimary_whenExists_fallbackOn() {
        // Arrange
        Translation primary = new Translation();
        primary.setContent("Primary Content");
        primary.setFieldType(FieldType.TEXT);

        when(translationRepository.findByIdentityIdAndLangAndFieldName(identityId, langEn, field))
                .thenReturn(Optional.of(primary));

        // Act
        String result = translationService.getText(identityId, field, langEn, true);

        // Assert
        assertEquals("Primary Content", result);
        verify(translationRepository, times(1)).findByIdentityIdAndLangAndFieldName(any(), any(), any());
    }

    @Test
    @DisplayName("Should return default translation when primary missing (Fallback ON)")
    void shouldReturnDefault_whenPrimaryMissing_fallbackOn() {
        // Arrange
        Translation fallbackTrans = new Translation();
        fallbackTrans.setContent("Default Content");
        fallbackTrans.setFieldType(FieldType.TEXT);

        when(translationRepository.findByIdentityIdAndLangAndFieldName(identityId, langEn, field))
                .thenReturn(Optional.empty());
        when(translationRepository.findByIdentityIdAndLangAndFieldName(identityId, langSv, field))
                .thenReturn(Optional.of(fallbackTrans));

        // Act
        String result = translationService.getText(identityId, field, langEn, true);

        // Assert
        assertEquals("Default Content", result);
    }

    @Test
    @DisplayName("Should return null when primary missing (Fallback OFF)")
    void shouldReturnNull_whenPrimaryMissing_fallbackOff() {
        // Arrange
        when(translationRepository.findByIdentityIdAndLangAndFieldName(identityId, langEn, field))
                .thenReturn(Optional.empty());

        // Act
        String result = translationService.getText(identityId, field, langEn, false);

        // Assert
        assertNull(result);
        verify(translationRepository, never()).findByIdentityIdAndLangAndFieldName(identityId, langSv, field);
    }

    @Test
    @DisplayName("Should return null when both missing (Fallback ON)")
    void shouldReturnNull_whenBothMissing_fallbackOn() {
        // Arrange
        when(translationRepository.findByIdentityIdAndLangAndFieldName(identityId, langEn, field))
                .thenReturn(Optional.empty());
        when(translationRepository.findByIdentityIdAndLangAndFieldName(identityId, langSv, field))
                .thenReturn(Optional.empty());

        // Act
        String result = translationService.getText(identityId, field, langEn, true);

        // Assert
        assertNull(result);
    }

    @Test
    @DisplayName("Should throw IllegalState when accessing RichText via getText")
    void shouldThrowIllegalState_whenRichTextAccessedAsText() {
        // Arrange
        Translation richTextTrans = new Translation();
        richTextTrans.setFieldType(FieldType.RICH_TEXT);

        when(translationRepository.findByIdentityIdAndLangAndFieldName(identityId, langEn, field))
                .thenReturn(Optional.of(richTextTrans));

        // Act & Assert
        assertThrows(IllegalStateException.class, () -> translationService.getText(identityId, field, langEn, false));
    }

    @Test
    @DisplayName("Should throw IllegalState when accessing Text via getRichText")
    void shouldThrowIllegalState_whenTextAccessedAsRichText() {
        // Arrange
        Translation textTrans = new Translation();
        textTrans.setFieldType(FieldType.TEXT);

        when(translationRepository.findByIdentityIdAndLangAndFieldName(identityId, langEn, field))
                .thenReturn(Optional.of(textTrans));

        // Act & Assert
        assertThrows(IllegalStateException.class, () -> translationService.getRichText(identityId, field, langEn, false));
    }

    @Test
    @DisplayName("Should throw InternalServer when JSON parsing fails")
    void shouldThrowInternalServer_whenJsonParsingFails() throws Exception {
        // Arrange
        Translation richTextTrans = new Translation();
        richTextTrans.setFieldType(FieldType.RICH_TEXT);
        richTextTrans.setContent("invalid-json");

        when(translationRepository.findByIdentityIdAndLangAndFieldName(identityId, langEn, field))
                .thenReturn(Optional.of(richTextTrans));
        when(objectMapper.readTree("invalid-json")).thenThrow(mock(JsonProcessingException.class));

        // Act & Assert
        assertThrows(InternalServerErrorException.class, () -> translationService.getRichText(identityId, field, langEn, false));
    }

    @Test
    @DisplayName("Should delete translation when upserting null content")
    void shouldDeleteTranslation_whenUpsertingNull() {
        // Arrange
        TranslationSet ts = new TranslationSet(identityId, langEn);
        Translation t = new Translation();
        
        when(translationSetRepository.findFirstByIdentityIdAndLang(identityId, langEn)).thenReturn(Optional.of(ts));
        when(translationRepository.findByIdentityIdAndLangAndFieldName(identityId, langEn, field)).thenReturn(Optional.of(t));

        // Act
        translationService.upsertText(identityId, langEn, null, field);

        // Assert
        verify(translationRepository).delete(t);
    }

    @Test
    @DisplayName("Should upsert rich text successfully")
    void shouldUpsertRichText() throws Exception {
        // Arrange
        JsonNode node = new TextNode("rich-content");
        when(objectMapper.writeValueAsString(node)).thenReturn("\"rich-content\"");
        when(translationSetRepository.findFirstByIdentityIdAndLang(identityId, langEn)).thenReturn(Optional.of(new TranslationSet()));
        when(translationRepository.findByIdentityIdAndLangAndFieldName(identityId, langEn, field)).thenReturn(Optional.empty());

        // Act
        translationService.upsertRichText(identityId, langEn, node, field);

        // Assert
        verify(translationRepository).save(argThat(t -> 
            t.getContent().equals("\"rich-content\"") && t.getFieldType() == FieldType.RICH_TEXT
        ));
    }

    @Test
    @DisplayName("Should create TranslationSet and Translation during upsert if missing")
    void shouldCreateSetAndTranslation_whenMissing() {
        // Arrange
        String content = "New Content";
        when(translationSetRepository.findFirstByIdentityIdAndLang(identityId, langEn)).thenReturn(Optional.empty());
        when(translationSetRepository.save(any(TranslationSet.class))).thenAnswer(i -> i.getArgument(0));
        when(translationRepository.findByIdentityIdAndLangAndFieldName(identityId, langEn, field)).thenReturn(Optional.empty());

        // Act
        translationService.upsertText(identityId, langEn, content, field);

        // Assert
        verify(translationSetRepository).save(any(TranslationSet.class));
        verify(translationRepository).save(argThat(t -> 
            t.getContent().equals(content) && t.getFieldName() == field
        ));
    }

    @Test
    @DisplayName("Should detect non-default language translations")
    void shouldDetectNonDefaultTranslations() {
        // Arrange
        TranslationSet tsEn = new TranslationSet(identityId, Language.EN);
        TranslationSet tsSv = new TranslationSet(identityId, Language.SV);

        when(translationSetRepository.findAllByIdentityId(identityId)).thenReturn(Optional.of(List.of(tsSv)));
        assertFalse(translationService.hasNonDefaultLangTranslations(identityId));

        when(translationSetRepository.findAllByIdentityId(identityId)).thenReturn(Optional.of(List.of(tsSv, tsEn)));
        assertTrue(translationService.hasNonDefaultLangTranslations(identityId));
        
        when(translationSetRepository.findAllByIdentityId(identityId)).thenReturn(Optional.empty());
        assertFalse(translationService.hasNonDefaultLangTranslations(identityId));
    }

    @Test
    @DisplayName("Should remove all translations for a language")
    void shouldRemoveTranslationsByLang() {
        // Arrange
        TranslationSet ts = new TranslationSet(identityId, langEn);
        when(translationSetRepository.findFirstByIdentityIdAndLang(identityId, langEn)).thenReturn(Optional.of(ts));

        // Act
        translationService.removeTranslationsByLang(identityId, langEn);

        // Assert
        verify(translationSetRepository).delete(ts);
    }

    @Test
    @DisplayName("Should throw exception when removing translations for missing set")
    void shouldThrowException_whenRemovingMissingSet() {
        // Arrange
        when(translationSetRepository.findFirstByIdentityIdAndLang(identityId, langEn)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ElementNotFoundException.class, () -> translationService.removeTranslationsByLang(identityId, langEn));
    }

    @Test
    @DisplayName("Should throw InternalServer when JSON serialization fails")
    void shouldThrowInternalServer_whenJsonSerializationFails() throws Exception {
        // Arrange
        JsonNode node = new TextNode("test");
        when(objectMapper.writeValueAsString(node)).thenThrow(mock(JsonProcessingException.class));

        // Act & Assert
        assertThrows(InternalServerErrorException.class, () -> translationService.upsertRichText(identityId, langEn, node, field));
    }
    
    @Test
    @DisplayName("Should return null when language is null")
    void shouldReturnNull_whenLangIsNull() {
        assertNull(translationService.getText(identityId, field, null, true));
        assertNull(translationService.getRichText(identityId, field, null, true));
        
        translationService.upsertText(identityId, null, "test", field);
        verifyNoInteractions(translationRepository);
    }
}
