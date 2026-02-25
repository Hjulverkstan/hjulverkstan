package se.hjulverkstan.main.feature.webedit.translation;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.error.exceptions.InternalServerErrorException;
import se.hjulverkstan.main.shared.AppConstants;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class TranslationService {

    private final ObjectMapper objectMapper;
    private final TranslationSetRepository translationSetRepository;
    private final TranslationRepository translationRepository;

    public void upsertText(
            UUID identityId,
            Language lang,
            @Nullable String value,
            FieldName field
    ) {
        upsertCore(identityId, lang, field, FieldType.TEXT, value);
    }

    public void upsertRichText(
            UUID identityId,
            Language lang,
            @Nullable JsonNode value,
            FieldName field
    ) {
        upsertCore(identityId, lang, field, FieldType.RICH_TEXT, (value == null ? null : writeJson(value)));
    }

    public @Nullable String getText(
            UUID identityId, FieldName field, Language lang, boolean fallback
    ) {
        if (lang == null) return null;

        Translation lc = findWithFallback(identityId, field, lang, fallback);
        if (lc == null) return null;
        if (lc.getFieldType() == FieldType.RICH_TEXT) {
            throw new IllegalStateException("Field " + field + " is RICH_TEXT; use getLocalisedRichText().");
        }
        return lc.getContent();
    }

    public @Nullable JsonNode getRichText(
            UUID identityId, FieldName field, Language lang, boolean fallback
    ) {
        if (lang == null) return null;

        Translation lc = findWithFallback(identityId, field, lang, fallback);
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

    public void removeTranslationsByLang (UUID identityId, Language lang) {
        TranslationSet ts = translationSetRepository.findFirstByIdentityIdAndLang(identityId, lang)
                .orElseThrow(() -> new ElementNotFoundException("TranslationSet"));

        translationSetRepository.delete(ts);
    }

    public boolean hasNonDefaultLangTranslations(UUID identityId) {
        List<TranslationSet> all = translationSetRepository.findAllByIdentityId(identityId)
                .orElse(new ArrayList<TranslationSet>());

        return all.stream().anyMatch(t -> t.getLang() != AppConstants.DEFAULT_LANGUAGE);
    }

    // Private

    private void upsertCore(
         UUID identityId,
         Language lang,
         FieldName field,
         FieldType type,
         @Nullable String serializedContent
    ) {
        if (lang == null) return;

        // Handle delete - null should remove translation (in case we get non-required translatable fields...)
        if (serializedContent == null) {
            translationSetRepository.findFirstByIdentityIdAndLang(identityId, lang)
                    .flatMap(ts -> translationRepository
                            .findByIdentityIdAndLangAndFieldName(ts.getIdentityId(), lang, field))
                    .ifPresent(translationRepository::delete);
            return;
        }

        // Ensure the set exists
        TranslationSet ts = translationSetRepository.findFirstByIdentityIdAndLang(identityId, lang)
                .orElseGet(() -> translationSetRepository.save(new TranslationSet(identityId, lang)));

        // Find existing translation, or create
        Translation t = translationRepository.findByIdentityIdAndLangAndFieldName(identityId, lang, field)
                .orElseGet(() -> {
                    Translation created = new Translation();
                    created.setTranslationSet(ts);
                    created.setFieldName(field);
                    return created;
                });

        // Upsert fields
        t.setFieldType(type);
        t.setContent(serializedContent);

        translationRepository.save(t);
    }

    private @Nullable Translation findWithFallback(
            UUID identityId, FieldName field, Language lang, boolean fallback) {

        Translation primary = translationRepository.findByIdentityIdAndLangAndFieldName(identityId, lang, field)
                .orElse(null);

        return fallback
                ? primary == null
                    ? translationRepository.findByIdentityIdAndLangAndFieldName(identityId, AppConstants.DEFAULT_LANGUAGE, field).orElse(null)
                    : primary
                : primary;
    }

    private String writeJson(JsonNode node) {
        try {
            return objectMapper.writeValueAsString(node);
        } catch (JsonProcessingException e) {
            throw new InternalServerErrorException("Failed to serialize rich-text JSON", e);
        }
    }
}