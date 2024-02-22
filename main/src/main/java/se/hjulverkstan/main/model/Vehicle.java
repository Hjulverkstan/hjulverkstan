package se.hjulverkstan.main.model;


import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Entity
@Setter
@Getter
@Data
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vehicleType;
    private String status;
    private String linkToImg;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private String comment;

}
