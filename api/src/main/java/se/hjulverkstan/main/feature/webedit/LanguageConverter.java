package se.hjulverkstan.main.feature.webedit;

import org.springframework.stereotype.Component;
import org.springframework.core.convert.converter.Converter;
import se.hjulverkstan.main.feature.webedit.localisation.Language;

import java.util.Arrays;

@Component
public class LanguageConverter implements Converter<String, Language> {

    @Override
    public Language convert(String source) {
        if (source == null || source.isEmpty()) {
            return null;
        }
        // Case-insensitive match
        return Arrays.stream(Language.values())
                .filter(lang -> lang.name().equalsIgnoreCase(source))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown language: " + source));
    }
}