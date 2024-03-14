package se.hjulverkstan.main.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewWorkshopDto {
    private String address;
    private String phoneNumber;
    private Long latitude;
    private Long longitude;
    private String comment;
}
