package se.hjulverkstan.main.feature.webedit;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.junit.jupiter.params.provider.ValueSource;
import se.hjulverkstan.main.feature.webedit.translation.Language;

import static org.junit.jupiter.api.Assertions.*;

class LanguageConverterTest {

    private final LanguageConverter converter = new LanguageConverter();

    @ParameterizedTest
    @EnumSource(Language.class)
    void convert_AllEnumValues_ReturnsCorrectEnum(Language language) {
        assertEquals(language, converter.convert(language.name()));
    }

    @ParameterizedTest
    @ValueSource(strings = {"en", "SV", "En", "sV"})
    void convert_CaseInsensitiveMatch_ReturnsEnum(String source) {
        Language expected = Language.valueOf(source.toUpperCase());
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
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> converter.convert("FR"));
        assertEquals("Unknown language: FR", ex.getMessage());
    }
}
