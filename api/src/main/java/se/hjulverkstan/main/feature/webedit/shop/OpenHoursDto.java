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
        openHours.setMon(mon);
        openHours.setTue(tue);
        openHours.setWed(wed);
        openHours.setThu(thu);
        openHours.setFri(fri);
        openHours.setSat(sat);
        openHours.setSun(sun);
        return openHours;
    }
}
