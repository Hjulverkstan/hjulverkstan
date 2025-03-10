package se.hjulverkstan.main.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewEmployeeDto {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    private String phoneNumber;

    @Email(message = "Email must be valid")
    @NotBlank(message = "Email is required")
    private String email;

    @Pattern(
            regexp = "^\\d{8}-\\d{4}$",
            message = "Personal Identity Number must be in the format YYYYMMDD-XXXX"
    )
    private String personalIdentityNumber;

    private String comment;
}
