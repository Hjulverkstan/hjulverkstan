package se.hjulverkstan.main.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Any empty strings in DTOs are converted to null
 */

@Configuration
public class JacksonConfig {
    @Bean
    public Jackson2ObjectMapperBuilderCustomizer emptyStringAsNullCustomizer() {
        return builder -> {
            builder.featuresToEnable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT);
            builder.featuresToEnable(SerializationFeature.WRITE_ENUMS_USING_TO_STRING);
            builder.featuresToEnable(DeserializationFeature.READ_ENUMS_USING_TO_STRING);
        };
    }
}