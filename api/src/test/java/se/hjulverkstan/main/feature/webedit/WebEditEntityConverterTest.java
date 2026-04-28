package se.hjulverkstan.main.feature.webedit;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

class WebEditEntityConverterTest {

    private final WebEditEntityConverter converter = new WebEditEntityConverter();

    @ParameterizedTest
    @EnumSource(WebEditEntity.class)
    void convert_AllEnumValues_ReturnsCorrectEnum(WebEditEntity entity) {
        assertEquals(entity, converter.convert(entity.name()));
    }

    @ParameterizedTest
    @ValueSource(strings = {"text", "SHOP", "Story"})
    void convert_CaseInsensitiveMatch_ReturnsEnum(String source) {
        WebEditEntity expected = WebEditEntity.valueOf(source.toUpperCase());
        assertEquals(expected, converter.convert(source));
    }

    @Test
    void convert_NullSource_ReturnsNull() {
        assertNull(converter.convert(null));
    }

    @Test
    void convert_EmptySource_ReturnsNull() {
        assertNull(converter.convert(""));
    }

    @Test
    void convert_UnknownCode_ThrowsIllegalArgumentException() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> converter.convert("unknown"));
        assertEquals("Unknown web-edit entity: unknown", ex.getMessage());
    }
}
