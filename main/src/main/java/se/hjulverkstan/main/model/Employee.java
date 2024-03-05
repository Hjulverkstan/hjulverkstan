package se.hjulverkstan.main.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.PRIVATE)
    private Long id;
    private String name;
    private String lastName;
    private String phoneNumber;
    private String email;

    @ManyToOne
    @JoinColumn(name = "workshop_id")
    private Workshop workshop;

    @OneToMany(mappedBy = "employee")
    private List<Ticket> tickets;

    private String comment;

    // Metadata
    private LocalDateTime createdAt;
    private Long createdBy;
    private LocalDateTime updatedAt;
    private Long updatedBy;
}
