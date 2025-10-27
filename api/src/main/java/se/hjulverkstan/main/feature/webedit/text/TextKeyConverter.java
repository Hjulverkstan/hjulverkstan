package se.hjulverkstan.main.feature.webedit.text;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * Enables the use of enums values instead of enums names
 */
@Converter(autoApply = true)
public class TextKeyConverter implements AttributeConverter<TextKey, String> {
    @Override public String convertToDatabaseColumn(TextKey attr) {
        return attr == null ? null : attr.getKey();
    }
    @Override public TextKey convertToEntityAttribute(String db) {
        return db == null ? null : TextKey.fromKey(db);
    }
}