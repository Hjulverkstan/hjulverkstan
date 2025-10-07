package se.hjulverkstan.main.feature.webedit.localisation;

import java.util.List;
import java.util.function.Consumer;

public class LocalisedContentUtils {

    /**
     * Adds, updates, or removes a localized content entry for an entity.
     * <p>
     * If a LocalisedContent for the given language exists:
     *   - value != null → updates content
     *   - value == null → removes it
     * Otherwise, if value != null, a new LocalisedContent is created.
     * </p>
     *
     * @param <T>       Entity type implementing {@link Localised}
     * @param entity    Parent entity containing localized content
     * @param lang      Language of the content
     * @param value     Value to set; null deletes existing content
     * @param fieldName Field this content represents
     * @param setParent Lambda to set parent in the new LocalisedContent
     */
    public static <T extends Localised> void upsertLocalisedContent(
            T entity,
            Language lang,
            String value,
            FieldNameType fieldName,
            Consumer<LocalisedContent> setParent
    ) {
        List<LocalisedContent> contents = entity.getLocalisedContent();

        LocalisedContent existing = contents.stream()
                .filter(lc -> lang.equals(lc.getLang()) && fieldName.equals(lc.getFieldName()))
                .findFirst()
                .orElse(null);

        if (existing != null) {
            if (value == null) contents.remove(existing);
            else existing.setContent(value);
        } else if (value != null) {
            LocalisedContent lc = new LocalisedContent();
            lc.setLang(lang);
            lc.setFieldName(fieldName);
            lc.setContent(value);
            setParent.accept(lc);
            contents.add(lc);
        }
    }

    public static <T extends Localised> String getLocalisedValue (T entity, Language lang, Language fallbackLang) {
        String value = getLocalisedValueByLang(entity, lang);
        return (value == null && lang != fallbackLang) ? getLocalisedValueByLang(entity, fallbackLang) : value;
    }

    public static <T extends Localised> String getLocalisedValue (T entity, Language lang) {
        return getLocalisedValueByLang(entity, lang);
    }

    private static <T extends Localised> String getLocalisedValueByLang (T entity, Language lang) {
        return entity.getLocalisedContent().stream()
                .filter(lc -> lang.equals(lc.getLang()))
                .map(LocalisedContent::getContent)
                .findFirst()
                .orElse(null);
    }
}