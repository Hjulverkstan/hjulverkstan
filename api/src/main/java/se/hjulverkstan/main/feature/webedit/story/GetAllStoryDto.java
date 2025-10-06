package se.hjulverkstan.main.feature.webedit.story;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.feature.webedit.localisation.Language;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAllStoryDto {
    private List<StoryDto> stories;

    public GetAllStoryDto (List<Story> stories, Language lang, Language fallbackLang) {
        this.stories = stories.stream().map(story -> new StoryDto(story, lang, fallbackLang)).toList();
    }
}
