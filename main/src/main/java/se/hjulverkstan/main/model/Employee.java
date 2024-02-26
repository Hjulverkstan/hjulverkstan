package se.hjulverkstan.main.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Data
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long id;
    private String name;
    private String lastName;
    private String phoneNumber;
    private String email;
    //TODO: remove comment when workshops added
    /*@ManyToOne
    @JoinColumn(name = "workshop_id")
    private Workshop workshop;*/

    // Metadata
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long updatedBy;
    private String comment;
}
