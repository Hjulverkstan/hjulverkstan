package se.hjulverkstan.main.feature.webedit.shop;

import org.junit.jupiter.api.Test;
import se.hjulverkstan.main.error.exceptions.InvalidDataException;

import static org.junit.jupiter.api.Assertions.*;

class OpenHoursTest {

    @Test
    void settersAndGetters_WorkCorrectly() {
        OpenHours oh = new OpenHours();
        oh.setMon("08:00-17:00");
        oh.setTue("08:00-17:00");
        oh.setWed("08:00-17:00");
        oh.setThu("08:00-17:00");
        oh.setFri("08:00-16:00");
        oh.setSat("10:00-14:00");
        oh.setSun(null);

        assertEquals("08:00-17:00", oh.getMon());
        assertEquals("08:00-17:00", oh.getTue());
        assertEquals("08:00-17:00", oh.getWed());
        assertEquals("08:00-17:00", oh.getThu());
        assertEquals("08:00-16:00", oh.getFri());
        assertEquals("10:00-14:00", oh.getSat());
        assertNull(oh.getSun());
    }

    @Test
    void id_CanBeSetAndRetrieved() {
        OpenHours oh = new OpenHours();
        oh.setId(1L);
        assertEquals(1L, oh.getId());
    }

    @Test
    void closedDay_IsRepresentedAsNull() {
        OpenHours oh = new OpenHours();
        // Closed days are represented as null (no hours)
        assertNull(oh.getSun());
        assertNull(oh.getSat());
    }

    @Test
    void equalsAndHashCode_WorkCorrectly() {
        OpenHours oh1 = new OpenHours();
        oh1.setId(1L);
        oh1.setMon("08:00-17:00");

        OpenHours oh2 = new OpenHours();
        oh2.setId(1L);
        oh2.setMon("08:00-17:00");

        assertEquals(oh1, oh2);
        assertEquals(oh1.hashCode(), oh2.hashCode());
    }

    @Test
    void toString_ContainsDayFields() {
        OpenHours oh = new OpenHours();
        oh.setMon("09:00-18:00");

        String str = oh.toString();

        assertTrue(str.contains("mon"));
        assertTrue(str.contains("09:00-18:00"));
    }

    @Test
    void validate_ValidHours_DoesNotThrow() {
        OpenHoursDto dto = new OpenHoursDto();
        dto.setMon("08:00-17:00");
        dto.setSat("10:00-14:00");
        
        assertDoesNotThrow(dto::validate);
    }

    @Test
    void validate_InvalidFormat_ThrowsException() {
        OpenHoursDto dto = new OpenHoursDto();
        dto.setMon("8-17");
        
        InvalidDataException ex = assertThrows(InvalidDataException.class, dto::validate);
        assertTrue(ex.getMessage().contains("Invalid time slot format for Monday"));
    }

    @Test
    void validate_StartAfterEnd_ThrowsException() {
        OpenHoursDto dto = new OpenHoursDto();
        dto.setMon("17:00-08:00");
        
        InvalidDataException ex = assertThrows(InvalidDataException.class, dto::validate);
        assertTrue(ex.getMessage().contains("Start time must be before end time for Monday"));
    }

    @Test
    void validate_SameStartAndEnd_ThrowsException() {
        OpenHoursDto dto = new OpenHoursDto();
        dto.setMon("08:00-08:00");
        
        InvalidDataException ex = assertThrows(InvalidDataException.class, dto::validate);
        assertTrue(ex.getMessage().contains("Start time must be before end time for Monday"));
    }

    @Test
    void validate_InvalidTimeValue_ThrowsException() {
        OpenHoursDto dto = new OpenHoursDto();
        dto.setMon("25:00-26:00");
        
        InvalidDataException ex = assertThrows(InvalidDataException.class, dto::validate);
        assertTrue(ex.getMessage().contains("Invalid time value in slot for Monday"));
    }
}
