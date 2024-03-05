package se.hjulverkstan.main.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
public class Workshop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.PRIVATE)
    private Long id;

    //TODO: decide what fields we actually want here. ex: latLong
    private String address;
    private String phoneNumber;
    private Long latitude;
    private Long longitude;

    @OneToMany(mappedBy = "workshop")
    private List<Employee> employees;

    private String comment;

    // Metadata
    private LocalDateTime createdAt;
    private Long createdBy;
    private LocalDateTime updatedAt;
    private Long updatedBy;
}
