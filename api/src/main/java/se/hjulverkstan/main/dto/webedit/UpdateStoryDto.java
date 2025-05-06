package se.hjulverkstan.main.dto.webedit;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStoryDto {
    @NotBlank(message = "Story title is required")
    private String title;
    @NotBlank(message = "Story body text is required")
    private String bodyText;
    private String imageURL;
}
