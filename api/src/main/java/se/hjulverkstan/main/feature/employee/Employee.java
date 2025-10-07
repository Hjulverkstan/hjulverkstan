package se.hjulverkstan.main.feature.employee;

import jakarta.persistence.*;
import lombok.*;
import se.hjulverkstan.main.feature.ticket.Ticket;
import se.hjulverkstan.main.shared.auditable.Auditable;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
public class Employee extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.PRIVATE)
    private Long id;

    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
    private String personalIdentityNumber;
    private String comment;

    @OneToMany(mappedBy = "employee")
    private List<Ticket> tickets = new ArrayList<>();
}
