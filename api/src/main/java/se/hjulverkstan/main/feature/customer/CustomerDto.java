package se.hjulverkstan.main.feature.customer;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.feature.ticket.Ticket;
import se.hjulverkstan.main.shared.auditable.AuditableDto;

import java.util.ArrayList;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class CustomerDto extends AuditableDto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @JsonSerialize(using = ToStringSerializer.class)
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

    @NotBlank(message = "Customer phone number is required")
    private String phoneNumber;

    @NotBlank(message = "Customer email is required")
    @Email(message = "Customer email must be valid")
    private String email;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @JsonSerialize(contentUsing = ToStringSerializer.class)
    private List<Long> ticketIds = new ArrayList<>();

    private String organizationName;
    private String comment;

    public CustomerDto(Customer customer) {
        super(customer);

        id = customer.getId();
        firstName = customer.getFirstName();
        lastName = customer.getLastName();
        customerType = customer.getCustomerType();
        personalIdentityNumber = customer.getPersonalIdentityNumber();
        organizationName = customer.getOrganizationName();
        phoneNumber = customer.getPhoneNumber();
        email = customer.getEmail();
        ticketIds = customer.getTickets().stream().map(Ticket::getId).toList();
        comment = customer.getComment();
    }

    public Customer applyToEntity (Customer customer) {
        customer.setFirstName(firstName);
        customer.setLastName(lastName);
        customer.setCustomerType(customerType);
        customer.setPersonalIdentityNumber(personalIdentityNumber);
        customer.setOrganizationName(organizationName);
        customer.setPhoneNumber(phoneNumber);
        customer.setEmail(email);
        customer.setComment(comment);

        return customer;
    }
}
