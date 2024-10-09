package se.hjulverkstan.main.model.user;

import jakarta.persistence.*;
import lombok.*;
import se.hjulverkstan.main.model.base.Auditable;
import se.hjulverkstan.main.model.ticket.Ticket;

import java.util.List;

@Getter
@Setter
@ToString
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
    private List<Ticket> tickets;
    private String comment;
}
