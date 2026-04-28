package se.hjulverkstan.main.shared.auditable;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

class AuditableDtoTest {

    @Test
    void constructor_MapsAllFieldsCorrectly() {
        LocalDateTime now = LocalDateTime.now();
        Auditable entity = new TestAuditable();
        entity.setCreatedAt(now);
        entity.setUpdatedAt(now.plusDays(1));
        entity.setCreatedBy(1L);
        entity.setUpdatedBy(2L);

        AuditableDto dto = new AuditableDto(entity);

        assertEquals(now, dto.getCreatedAt());
        assertEquals(now.plusDays(1), dto.getUpdatedAt());
        assertEquals("1", dto.getCreatedBy());
        assertEquals("2", dto.getUpdatedBy());
    }

    @Test
    void constructor_HandlesNullAuditFields() {
        Auditable entity = new TestAuditable();
        // createdAt/updatedAt are usually non-null in DB, but let's test null-safety
        entity.setCreatedAt(null);
        entity.setCreatedBy(null);

        AuditableDto dto = new AuditableDto(entity);

        assertNull(dto.getCreatedAt());
        assertNull(dto.getCreatedBy());
    }

    @Test
    void settersAndGetters_WorkCorrectly() {
        AuditableDto dto = new AuditableDto();
        LocalDateTime now = LocalDateTime.now();
        
        dto.setCreatedAt(now);
        dto.setCreatedBy("admin");
        
        assertEquals(now, dto.getCreatedAt());
        assertEquals("admin", dto.getCreatedBy());
    }

    // Concrete implementation for testing abstract Auditable
    private static class TestAuditable extends Auditable {}
}
