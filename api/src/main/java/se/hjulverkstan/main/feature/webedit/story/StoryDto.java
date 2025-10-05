package se.hjulverkstan.main.feature.webedit.story;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.feature.webedit.localisation.Language;
import se.hjulverkstan.main.feature.webedit.localisation.LocalisedContent;
import se.hjulverkstan.main.feature.webedit.localisation.LocalisedContentUtils;
import se.hjulverkstan.main.shared.AuditableDto;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StoryDto extends AuditableDto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    @NotNull(message = "Story title is required")
    private String title;

    @NotNull(message = "Story body text is required")
    private String bodyText;

    private String imageURL;

    public StoryDto(Story story, Language lang, Language fallbackLang) {
        super(story);

        id = story.getId();
        title = story.getTitle();
        imageURL = story.getImageURL();
        bodyText = LocalisedContentUtils.getLocalisedValue(story, lang, fallbackLang);
    }

    // Localised content should be set in service layer
    public Story applyToEntity (Story story) {
        story.setId(id);
        story.setTitle(title);
        story.setImageURL(imageURL);

        return story;
    }
}
