package se.hjulverkstan.main.model.user;

import jakarta.persistence.*;
import lombok.*;
import se.hjulverkstan.main.model.base.Auditable;
import se.hjulverkstan.main.model.ticket.Ticket;

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
    private String employeeNumber;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
    private String personalIdentityNumber;
    private String comment;

    @OneToMany(mappedBy = "employee")
    private List<Ticket> tickets;
}
