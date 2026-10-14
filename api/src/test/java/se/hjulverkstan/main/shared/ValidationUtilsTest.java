package se.hjulverkstan.main.shared;
 
import org.junit.jupiter.api.Test;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.error.exceptions.MissingArgumentException;
import se.hjulverkstan.main.error.exceptions.UnsupportedArgumentException;
 
import java.util.List;
 
import static org.junit.jupiter.api.Assertions.*;
 
class ValidationUtilsTest {
 
    @Test
    void validateNotBlank_WhenValid_DoesNothing() {
        assertDoesNotThrow(() -> ValidationUtils.validateNotBlank("Valid String", "field"));
    }
 
    @Test
    void validateNotBlank_WhenNull_ThrowsMissingArgumentException() {
        MissingArgumentException ex = assertThrows(MissingArgumentException.class, 
            () -> ValidationUtils.validateNotBlank(null, "field"));
        assertEquals("field is required for this operation", ex.getMessage());
    }
 
    @Test
    void validateNotBlank_WhenEmpty_ThrowsMissingArgumentException() {
        assertThrows(MissingArgumentException.class, 
            () -> ValidationUtils.validateNotBlank("", "field"));
    }
 
    @Test
    void validateNotBlank_WhenWhitespace_ThrowsMissingArgumentException() {
        assertThrows(MissingArgumentException.class, 
            () -> ValidationUtils.validateNotBlank("   ", "field"));
    }
 
    @Test
    void validateNotNull_WhenValid_DoesNothing() {
        assertDoesNotThrow(() -> ValidationUtils.validateNotNull(new Object(), "field"));
    }
 
    @Test
    void validateNotNull_WhenNull_ThrowsMissingArgumentException() {
        MissingArgumentException ex = assertThrows(MissingArgumentException.class, 
            () -> ValidationUtils.validateNotNull(null, "field"));
        assertEquals("field is required for this operation", ex.getMessage());
    }
 
    @Test
    void validatePositive_WhenValid_DoesNothing() {
        assertDoesNotThrow(() -> ValidationUtils.validatePositive(1L, "field"));
    }
 
    @Test
    void validatePositive_WhenNull_ThrowsUnsupportedArgumentException() {
        UnsupportedArgumentException ex = assertThrows(UnsupportedArgumentException.class, 
            () -> ValidationUtils.validatePositive(null, "field"));
        assertTrue(ex.getMessage().contains("field"));
        assertTrue(ex.getMessage().contains("positive"));
    }
 
    @Test
    void validatePositive_WhenZero_ThrowsUnsupportedArgumentException() {
        assertThrows(UnsupportedArgumentException.class, 
            () -> ValidationUtils.validatePositive(0L, "field"));
    }
 
    @Test
    void validatePositive_WhenNegative_ThrowsUnsupportedArgumentException() {
        assertThrows(UnsupportedArgumentException.class, 
            () -> ValidationUtils.validatePositive(-1L, "field"));
    }
 
    @Test
    void validateNoMissing_WhenAllExist_DoesNothing() {
        List<Long> requestedIds = List.of(1L, 2L);
        List<TestEntity> entities = List.of(new TestEntity(1L), new TestEntity(2L));
        
        assertDoesNotThrow(() -> 
            ValidationUtils.validateNoMissing(requestedIds, entities, TestEntity::id, TestEntity.class));
    }
 
    @Test
    void validateNoMissing_WhenMissing_ThrowsElementNotFoundException() {
        List<Long> requestedIds = List.of(1L, 3L);
        List<TestEntity> entities = List.of(new TestEntity(1L));
        
        ElementNotFoundException ex = assertThrows(ElementNotFoundException.class, 
            () -> ValidationUtils.validateNoMissing(requestedIds, entities, TestEntity::id, TestEntity.class));
        
        assertTrue(ex.getMessage().contains("TestEntity"));
        assertTrue(ex.getMessage().contains("3"));
    }
 
    @Test
    void validateNoMissing_WhenRequestedNullOrEmpty_DoesNothing() {
        assertDoesNotThrow(() -> 
            ValidationUtils.validateNoMissing(null, List.of(), TestEntity::id, TestEntity.class));
        assertDoesNotThrow(() -> 
            ValidationUtils.validateNoMissing(List.of(), List.of(), TestEntity::id, TestEntity.class));
    }
 
    @Test
    void validateNoMissing_WhenEntitiesNull_ThrowsIfRequestedNotEmpty() {
        assertThrows(ElementNotFoundException.class, () -> 
            ValidationUtils.validateNoMissing(List.of(1L), null, TestEntity::id, TestEntity.class));
    }
 
    private record TestEntity(Long id) {}
}
