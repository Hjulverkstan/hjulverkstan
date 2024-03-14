package se.hjulverkstan.main.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewEmployeeDto {
    private String name;
    private String lastName;
    private String phoneNumber;
    private String email;
    private Long workshopId;
    private String comment;
}
