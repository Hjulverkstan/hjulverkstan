package se.hjulverkstan.main.model.webedit;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class OpenHours {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(mappedBy = "openHours")
    private Shop shop;

    private String mon;
    private String tue;
    private String wed;
    private String thu;
    private String fri;
    private String sat;
    private String sun;
}
