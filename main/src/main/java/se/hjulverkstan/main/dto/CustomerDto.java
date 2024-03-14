package se.hjulverkstan.main.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.Customer;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerDto {
    private Long id;

    private String name;
    private String lastName;
    private String phoneNumber;
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
                        .map(ticket -> ticket.getId())
                        .collect(Collectors.toList()),
                customer.getComment(),
                customer.getCreatedBy(),
                customer.getCreatedAt(),
                customer.getUpdatedBy(),
                customer.getUpdatedAt());
    }
}
