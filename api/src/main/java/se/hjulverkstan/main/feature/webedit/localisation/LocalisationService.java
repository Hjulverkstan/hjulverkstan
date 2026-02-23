package se.hjulverkstan.main.feature.webedit.localisation;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.error.exceptions.InternalServerErrorException;
import se.hjulverkstan.main.error.exceptions.MissingArgumentException;
import se.hjulverkstan.main.feature.webedit.releases.ReleaseService;

import java.util.UUID;

/**
 * Reads and writes localised content for CMS entities.
 * <p>
 * Responsibilities:
 * <ul>
 *   <li>Upsert plain text and rich text (JsonNode) localised values by (identityId, lang, field).</li>
 *   <li>Resolve localised values with an optional fallback language.</li>
 *   <li>Persist rich text as JSON serialised strings; parse back on read.</li>
 * </ul>
 * <p>
 * Conventions:
 * <ul>
 *   <li>Passing {@code null} value to an upsert method removes the entry for (lang, field).</li>
 *   <li>Type mismatches (e.g. requesting text for a rich-text field) throw {@link IllegalStateException}.</li>
 * </ul>
 */
@Component
@RequiredArgsConstructor
public class LocalisationService {

    private final ObjectMapper objectMapper;
    private final ReleaseService releaseService;

    /**
     * Adds, updates, or removes a plain text localised content entry for an identity and language.
     *
     * @param identityId Stable ID representing the conceptual entity
     * @param lang       Language of the content
     * @param value      Value to set; {@code null} deletes existing content
     * @param field      Field this content represents
     */
    @Transactional
    public void upsertText(
            UUID identityId,
            Language lang,
            String value,
            FieldName field
    ) {
        upsertCore(identityId, lang, field, FieldType.TEXT, value);
    }

    /**
     * Adds, updates, or removes a rich-text localised content entry for an identity and language.
     * Serialises the provided {@link JsonNode} to a String before persisting.
     *
     * @param identityId Stable ID representing the conceptual entity
     * @param lang       Language of the content
     * @param value      Rich-text JSON to set; {@code null} deletes existing content
     * @param field      Field this content represents
     */
    @Transactional
    public void upsertRichText(
            UUID identityId,
            Language lang,
            JsonNode value,
            FieldName field
    ) {
        upsertCore(identityId, lang, field, FieldType.RICH_TEXT, writeJson(value));
    }

    /**
     * Gets a plain text localised value for the given field and language.
     * Falls back to {@code fallback} when no value exists in {@code lang}.
     *
     * @param identityId Stable ID representing the conceptual entity
     * @param field      Field this content represents
     * @param lang       Preferred language
     * @param fallback   Optional fallback language (can be {@code null})
     * @return The text value, or {@code null} if neither preferred nor fallback exist
     * @throws IllegalStateException if stored content is rich-text
     */
    @Transactional(readOnly = true)
    public @Nullable String getText(
            UUID identityId,
            FieldName field,
            Language lang,
            @Nullable Language fallback
    ) {
        if (lang == null) return null;

        LocalisedContent lc = findWithFallback(identityId, field, lang, fallback);
        if (lc == null) return null;
        if (lc.getFieldType() == FieldType.RICH_TEXT) {
            throw new IllegalStateException("Field " + field + " is RICH_TEXT; use getRichText().");
        }
        return lc.getContent();
    }

    /**
     * Gets a rich-text localised value for the given field and language as a {@link JsonNode}.
     * Falls back to {@code fallback} when no value exists in {@code lang}.
     *
     * @param identityId Stable ID representing the conceptual entity
     * @param field      Field this content represents
     * @param lang       Preferred language
     * @param fallback   Optional fallback language (can be {@code null})
     * @return The rich-text JSON, or {@code null} if neither preferred nor fallback exist
     * @throws IllegalStateException if stored content is not rich-text
     */
    @Transactional(readOnly = true)
    public @Nullable JsonNode getRichText(
            UUID identityId,
            FieldName field,
            Language lang,
            @Nullable Language fallback
    ) {
        if (lang == null) return null;

        LocalisedContent lc = findWithFallback(identityId, field, lang, fallback);
        if (lc == null) return null;
        if (lc.getFieldType() != FieldType.RICH_TEXT) {
            throw new IllegalStateException("Field " + field + " is " + lc.getFieldType() + "; use getText().");
        }
        try {
            return objectMapper.readTree(lc.getContent());
        } catch (JsonProcessingException e) {
            throw new InternalServerErrorException("Failed to parse rich-text JSON for field " + field, e);
        }
    }

    // Private

    private void upsertCore(
            UUID identityId,
            Language lang,
            FieldName field,
            FieldType type,
            String serializedContent
    ) {
        if (lang == null) return;
        if (serializedContent == null) throw new MissingArgumentException("The required field " + field + " is null");

        TranslationSet set = releaseService.getOrCreateActiveTranslationSet(identityId, lang);

        LocalisedContent existing = set.getEntries().stream()
                .filter(e -> field.equals(e.getFieldName()))
                .findFirst()
                .orElse(null);

        if (existing != null) {
            existing.setFieldType(type);
            existing.setContent(serializedContent);
        } else {
            LocalisedContent lc = new LocalisedContent();
            lc.setTranslationSet(set);
            lc.setFieldName(field);
            lc.setFieldType(type);
            lc.setContent(serializedContent);
            set.getEntries().add(lc);
        }
    }

    private <T> @Nullable LocalisedContent findWithFallback(
            UUID identityId,
            FieldName field,
            Language lang,
            @Nullable Language fallback
    ) {
        LocalisedContent primary = findBestForLang(identityId, field, lang);
        if (primary != null) return primary;

        if (fallback != null && fallback != lang) {
            return findBestForLang(identityId, field, fallback);
        }
        return null;
    }

    private @Nullable LocalisedContent findBestForLang(UUID identityId, FieldName field, Language lang) {
        TranslationSet set = releaseService.findBestTranslationSetForRead(identityId, lang);
        if (set == null) return null;

        return set.getEntries().stream()
                .filter(e -> field.equals(e.getFieldName()))
                .findFirst()
                .orElse(null);
    }

    private String writeJson(JsonNode node) {
        try {
            return objectMapper.writeValueAsString(node);
        } catch (JsonProcessingException e) {
            throw new InternalServerErrorException("Failed to serialize rich-text JSON", e);
        }
    }
}