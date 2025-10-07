package se.hjulverkstan.main.feature.webedit.story;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.function.Function;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAllStoryDto {
    private List<StoryDto> stories;

    public GetAllStoryDto (List<Story> stories, Function<Story, StoryDto> mapper) {
        this.stories = stories.stream().map(mapper).toList();
    }
}
