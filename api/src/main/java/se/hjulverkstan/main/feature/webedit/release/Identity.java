package se.hjulverkstan.main.feature.webedit.release;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.feature.webedit.WebEditEntity;

import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class Identity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    private WebEditEntity entity;

    public Identity(WebEditEntity entity) {
        this.entity = entity;
    }
}
