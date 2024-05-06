package se.hjulverkstan.main.util.deserializer;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import se.hjulverkstan.Exceptions.UnsupportedArgumentException;
import se.hjulverkstan.main.model.webedit.Language;

import java.io.IOException;

public class CaseInsensitiveLanguageDeserializer extends JsonDeserializer<Language> {
    /**
     * Custom JSON deserializer for converting language codes to Language enum,
     * ignoring case sensitivity.
     */
    @Override
    public Language deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException{
        String value = jsonParser.getText().toUpperCase();
        try {
            return Language.valueOf(value);
        } catch (IllegalArgumentException e) {
            throw new UnsupportedArgumentException("Invalid language code: " + value);
        }
    }
}
