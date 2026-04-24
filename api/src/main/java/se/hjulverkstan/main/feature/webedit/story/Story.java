package se.hjulverkstan.main.feature.webedit.story;

import jakarta.persistence.*;
import lombok.*;
import se.hjulverkstan.main.feature.webedit.release.Releasable;

@Entity
@Data
@NoArgsConstructor
public class Story extends Releasable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String slug;
    private String imageURL;
    private boolean deleted = false;
}
