package se.hjulverkstan.main.feature.webedit.shop;

import se.hjulverkstan.main.error.exceptions.InvalidDataException;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;

public class OpenHoursUtils {

    private OpenHoursUtils() {}

    /**
     * Validates a time slot string (format HH:mm-HH:mm).
     * Ensures start time is before end time and format is correct.
     */
    public static void validateTimeSlot(String slot, String day) {
        if (slot == null || slot.isBlank()) {
            return;
        }

        if (!slot.matches("^\\d{2}:\\d{2}-\\d{2}:\\d{2}$")) {
            throw new InvalidDataException("Invalid time slot format for " + day + ". Expected HH:mm-HH:mm, got: " + slot);
        }

        String[] parts = slot.split("-");
        try {
            LocalTime start = LocalTime.parse(parts[0]);
            LocalTime end = LocalTime.parse(parts[1]);

            if (!start.isBefore(end)) {
                throw new InvalidDataException("Start time must be before end time for " + day + ": " + slot);
            }
        } catch (DateTimeParseException e) {
            throw new InvalidDataException("Invalid time value in slot for " + day + ": " + slot);
        }
    }
}
