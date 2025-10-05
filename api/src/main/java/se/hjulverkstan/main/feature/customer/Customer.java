package se.hjulverkstan.main.feature.customer;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import se.hjulverkstan.main.feature.ticket.Ticket;
import se.hjulverkstan.main.shared.Auditable;

import java.util.ArrayList;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class Customer extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private CustomerType customerType;

    private String firstName;
    private String lastName;
    private String personalIdentityNumber;
    private String organizationName;
    private String phoneNumber;
    private String email;

    @OneToMany(mappedBy = "customer")
    private List<Ticket> tickets = new ArrayList<>();

    private String comment;
}
