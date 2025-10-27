package se.hjulverkstan.main.feature.webedit.story;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import io.swagger.v3.core.util.Json;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.shared.auditable.AuditableDto;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StoryDto extends AuditableDto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    @NotNull(message = "Story title is required")
    private String title;

    @NotNull(message = "Story slug is required")
    private String slug;

    @NotNull(message = "Story body text is required")
    private JsonNode bodyText;

    private String imageURL;

    public StoryDto(Story story, JsonNode bodyTextLocalised) {
        super(story);

        id = story.getId();
        title = story.getTitle();
        slug = story.getSlug();
        imageURL = story.getImageURL();
        bodyText = bodyTextLocalised;
    }

    // Localized content can't be applied directly and is managed by the service.
    public Story applyToEntity (Story story) {
        story.setId(id);
        story.setTitle(title);
        story.setSlug(slug);
        story.setImageURL(imageURL);

        return story;
    }
}
