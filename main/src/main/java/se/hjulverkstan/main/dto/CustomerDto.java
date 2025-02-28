package se.hjulverkstan.main.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.Customer;
import se.hjulverkstan.main.model.CustomerType;
import se.hjulverkstan.main.model.Ticket;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerDto {
    private Long id;
    @NotNull(message = "Customer type is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private CustomerType customerType;

    @NotBlank(message = "Customer first name is required")
    private String firstName;

    @NotBlank(message = "Customer last name is required")
    private String lastName;

    @Pattern(
            regexp = "^\\d{8}-\\d{4}$",
            message = "Personal Identity Number must be in the format YYYYMMDD-XXXX"
    )
    private String personalIdentityNumber;

    private String organizationName;

    @NotBlank(message = "Customer phone number is required")
    private String phoneNumber;

    @NotBlank(message = "Customer email is required")
    @Email(message = "Customer email must be valid")
    private String email;

    private List<Long> ticketIds;

    private String comment;

    // Metadata
    private Long createdBy;
    private LocalDateTime createdAt;
    private Long updatedBy;
    private LocalDateTime updatedAt;

    public CustomerDto(Customer customer) {
        this(customer.getId(),
                customer.getCustomerType(),
                customer.getFirstName(),
                customer.getLastName(),
                customer.getPersonalIdentityNumber(),
                customer.getOrganizationName(),
                customer.getPhoneNumber(),
                customer.getEmail(),
                customer.getTickets()
                        .stream()
                        .map(Ticket::getId)
                        .collect(Collectors.toList()),
                customer.getComment(),
                customer.getCreatedBy(),
                customer.getCreatedAt(),
                customer.getUpdatedBy(),
                customer.getUpdatedAt());
    }
}
