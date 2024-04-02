package se.hjulverkstan.main.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.Customer;
import se.hjulverkstan.main.model.Ticket;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerDto {
    private Long id;

    @NotBlank(message = "Customer name is required")
    private String name;
    @NotBlank(message = "Customer last name is required")
    private String lastName;
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
                customer.getName(),
                customer.getLastName(),
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
