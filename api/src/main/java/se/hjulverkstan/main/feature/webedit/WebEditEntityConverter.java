package se.hjulverkstan.main.feature.webedit;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class WebEditEntityConverter implements Converter<String, WebEditEntity> {

    @Override
    public WebEditEntity convert(String source) {
        if (source == null || source.isEmpty()) {
            return null;
        }
        // Case-insensitive match
        return Arrays.stream(WebEditEntity.values())
                .filter(entity -> entity.name().equalsIgnoreCase(source))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown web-edit entity: " + source));
    }
}