package se.hjulverkstan.main.service.webedit;

import se.hjulverkstan.main.dto.webedit.*;
import se.hjulverkstan.main.model.webedit.Language;

import java.util.List;

public interface StoryService {
    List<StoryDto> getAllStoriesByLang(Language lang);
    StoryDto getStoryByIdAndLang(Long id, Language lang);
    StoryDto deleteStory(Long id);
    StoryDto createStory(NewStoryWithLangDto storyDto);
    StoryDto editStory(Long id, UpdateStoryWithLangDto storyDto);
}
