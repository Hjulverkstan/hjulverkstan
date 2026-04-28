package se.hjulverkstan.main.feature.webedit.shop;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class OpenHoursDto {
    private String mon;
    private String tue;
    private String wed;
    private String thu;
    private String fri;
    private String sat;
    private String sun;

    public OpenHoursDto(OpenHours openHours) {
        mon = openHours.getMon();
        tue = openHours.getTue();
        wed = openHours.getWed();
        thu = openHours.getThu();
        fri = openHours.getFri();
        sat = openHours.getSat();
        sun = openHours.getSun();
    }

    public OpenHours applyToEntity (OpenHours openHours) {
        validate();
        openHours.setMon(mon);
        openHours.setTue(tue);
        openHours.setWed(wed);
        openHours.setThu(thu);
        openHours.setFri(fri);
        openHours.setSat(sat);
        openHours.setSun(sun);
        return openHours;
    }

    public void validate() {
        OpenHoursUtils.validateTimeSlot(mon, "Monday");
        OpenHoursUtils.validateTimeSlot(tue, "Tuesday");
        OpenHoursUtils.validateTimeSlot(wed, "Wednesday");
        OpenHoursUtils.validateTimeSlot(thu, "Thursday");
        OpenHoursUtils.validateTimeSlot(fri, "Friday");
        OpenHoursUtils.validateTimeSlot(sat, "Saturday");
        OpenHoursUtils.validateTimeSlot(sun, "Sunday");
    }

    public boolean isEmpty() {
        return (mon == null || mon.isBlank()) &&
               (tue == null || tue.isBlank()) &&
               (wed == null || wed.isBlank()) &&
               (thu == null || thu.isBlank()) &&
               (fri == null || fri.isBlank()) &&
               (sat == null || sat.isBlank()) &&
               (sun == null || sun.isBlank());
    }
}
