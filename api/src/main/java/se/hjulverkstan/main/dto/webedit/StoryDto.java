package se.hjulverkstan.main.dto.webedit;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StoryDto {
    private Long id;

    @NotNull(message = "Story title is required")
    private String title;
    @NotNull(message = "Story body text is required")
    private String bodyText;
    private String imageURL;
}
