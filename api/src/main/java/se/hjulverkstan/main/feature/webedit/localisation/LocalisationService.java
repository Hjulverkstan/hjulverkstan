package se.hjulverkstan.main.feature.webedit.localisation;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import se.hjulverkstan.main.error.exceptions.InternalServerErrorException;

import java.util.List;
import java.util.function.Consumer;

/**
 * Reads and writes localised content for entities that implement {@link Localised}.
 * <p>
 * Responsibilities:
 * <ul>
 *   <li>Upsert plain text and rich text (JsonNode) localised values.</li>
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

    /**
     * Adds, updates, or removes a plain text localised content entry for an entity.
     * <p>
     * If an entry for (lang, field) exists:
     *   <ul>
     *     <li>{@code value != null} → updates content</li>
     *     <li>{@code value == null} → removes entry</li>
     *   </ul>
     * Otherwise, if {@code value != null}, a new entry is created.
     *
     * @param entity    Parent entity containing localised content
     * @param lang      Language of the content
     * @param value     Value to set; {@code null} deletes existing content
     * @param field     Field this content represents
     * @param setParent Lambda to set parent in the new {@link LocalisedContent}
     * @param <T>       Entity type implementing {@link Localised}
     */
    public <T extends Localised> void upsertText(
            T entity,
            Language lang,
            @Nullable String value,
            FieldName field,
            Consumer<LocalisedContent> setParent
    ) {
        upsertCore(entity, lang, field, FieldType.TEXT, value, setParent);
    }

    /**
     * Adds, updates, or removes a rich-text localised content entry for an entity.
     * <p>
     * Serialises the provided {@link JsonNode} to a String before persisting.
     * If an entry for (lang, field) exists:
     *   <ul>
     *     <li>{@code value != null} → updates content</li>
     *     <li>{@code value == null} → removes entry</li>
     *   </ul>
     * Otherwise, if {@code value != null}, a new entry is created.
     *
     * @param entity    Parent entity containing localised content
     * @param lang      Language of the content
     * @param value     Rich-text JSON to set; {@code null} deletes existing content
     * @param field     Field this content represents
     * @param setParent Lambda to set parent in the new {@link LocalisedContent}
     * @param <T>       Entity type implementing {@link Localised}
     */
    public <T extends Localised> void upsertRichText(
            T entity,
            Language lang,
            @Nullable JsonNode value,
            FieldName field,
            Consumer<LocalisedContent> setParent
    ) {
        upsertCore(entity, lang, field, FieldType.RICH_TEXT, (value == null ? null : writeJson(value)), setParent);
    }

    /**
     * Gets a plain text localised value for the given field and language.
     * Falls back to {@code fallback} when no value exists in {@code lang}.
     *
     * @param entity   Parent entity containing localised content
     * @param field    Field this content represents
     * @param lang     Preferred language
     * @param fallback Optional fallback language (can be {@code null})
     * @param <T>      Entity type implementing {@link Localised}
     * @return The text value, or {@code null} if neither preferred nor fallback exist
     * @throws IllegalStateException if stored content is rich-text
     */
    public <T extends Localised> @Nullable String getText(
            T entity, FieldName field, Language lang, @Nullable Language fallback
    ) {
        if (lang == null) return null;

        LocalisedContent lc = findWithFallback(entity, field, lang, fallback);
        if (lc == null) return null;
        if (lc.getFieldType() == FieldType.RICH_TEXT) {
            throw new IllegalStateException("Field " + field + " is RICH_TEXT; use getLocalisedRichText().");
        }
        return lc.getContent();
    }

    /**
     * Gets a rich-text localised value for the given field and language as a {@link JsonNode}.
     * Falls back to {@code fallback} when no value exists in {@code lang}.
     *
     * @param entity   Parent entity containing localised content
     * @param field    Field this content represents
     * @param lang     Preferred language
     * @param fallback Optional fallback language (can be {@code null})
     * @param <T>      Entity type implementing {@link Localised}
     * @return The rich-text JSON, or {@code null} if neither preferred nor fallback exist
     * @throws IllegalStateException if stored content is not rich-text
     */
    public <T extends Localised> @Nullable JsonNode getRichText(
            T entity, FieldName field, Language lang, @Nullable Language fallback
    ) {
        if (lang == null) return null;

        LocalisedContent lc = findWithFallback(entity, field, lang, fallback);
        if (lc == null) return null;
        if (lc.getFieldType() != FieldType.RICH_TEXT) {
            throw new IllegalStateException("Field " + field + " is " + lc.getFieldType() + "; use getLocalisedText().");
        }
        try {
            return objectMapper.readTree(lc.getContent());
        } catch (JsonProcessingException e) {
            throw new InternalServerErrorException("Failed to parse rich-text JSON for field " + field, e);
        }
    }

    /**
     * Remove all translations / localized contents of a specific lang on an entity.
     * @param entity Parent entity containing localized content
     * @param lang   Language to remove
     * @param <T>    Entity type implementing {@link Localised}
     */

    public <T extends Localised> void removeTranslationsByLang (T entity, Language lang) {
        List<LocalisedContent> contents = entity.getLocalisedContent();
        List<LocalisedContent> existing = contents.stream().filter(lc -> lang.equals(lc.getLang())).toList();

        contents.removeAll(existing);
    }

    // Private

    private <T extends Localised> void upsertCore(
            T entity,
            Language lang,
            FieldName field,
            FieldType type,
            @Nullable String serializedContent,
            Consumer<LocalisedContent> setParent
    ) {
        if (lang == null) return;

        List<LocalisedContent> contents = entity.getLocalisedContent();

        LocalisedContent existing = contents.stream()
                .filter(lc -> lang.equals(lc.getLang()) && field.equals(lc.getFieldName()))
                .findFirst()
                .orElse(null);

        if (existing != null) {
            if (serializedContent == null) {
                contents.remove(existing);
            } else {
                existing.setFieldType(type);
                existing.setContent(serializedContent);
            }
        } else if (serializedContent != null) {
            LocalisedContent lc = new LocalisedContent();
            lc.setLang(lang);
            lc.setFieldName(field);
            lc.setFieldType(type);
            lc.setContent(serializedContent);
            setParent.accept(lc);
            contents.add(lc);
        }
    }

    private <T extends Localised> @Nullable LocalisedContent findWithFallback(
            T entity, FieldName field, Language lang, @Nullable Language fallback
    ) {
        LocalisedContent primary = entity.getLocalisedContent().stream()
                .filter(x -> lang.equals(x.getLang()) && field.equals(x.getFieldName()))
                .findFirst().orElse(null);
        if (primary != null) return primary;

        if (fallback != null && fallback != lang) {
            return entity.getLocalisedContent().stream()
                    .filter(x -> fallback.equals(x.getLang()) && field.equals(x.getFieldName()))
                    .findFirst().orElse(null);
        }
        return null;
    }

    private String writeJson(JsonNode node) {
        try {
            return objectMapper.writeValueAsString(node);
        } catch (JsonProcessingException e) {
            throw new InternalServerErrorException("Failed to serialize rich-text JSON", e);
        }
    }
}