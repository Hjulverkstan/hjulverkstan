package se.hjulverkstan.main.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonProperty("last_name")
    private String lastName;
    @JsonProperty("phone_number")
    private String phoneNumber;
    private String email;
    @JsonProperty("ticket_ids")
    private List<Long> ticketIds;
    private String comment;

    // Metadata
    @JsonProperty("created_by")
    private Long createdBy;
    @JsonProperty("created_at")
    private LocalDateTime createdAt;
    @JsonProperty("updated_by")
    private Long updatedBy;
    @JsonProperty("updated_at")
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
