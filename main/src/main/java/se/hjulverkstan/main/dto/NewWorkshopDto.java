package se.hjulverkstan.main.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewWorkshopDto {
    @NotBlank(message = "Address is required")
    private String address;
    @Size(min = 10, max = 15)
    private String phoneNumber;
    private Long latitude;
    private Long longitude;
    private String comment;
}