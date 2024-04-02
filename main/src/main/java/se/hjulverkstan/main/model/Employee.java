package se.hjulverkstan.main.model;

import jakarta.persistence.*;
import lombok.*;
import se.hjulverkstan.main.model.base.Auditable;

import java.time.LocalDateTime;
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
    private String name;
    private String lastName;
    private String phoneNumber;
    private String email;
    private String personalIdentityNumber;
    private String comment;

    @ManyToOne
    @JoinColumn(name = "workshop_id")
    private Workshop workshop;

    @OneToMany(mappedBy = "employee")
    private List<Ticket> tickets;

    // Metadata
    private Long createdBy;
    private Long updatedBy;
}
