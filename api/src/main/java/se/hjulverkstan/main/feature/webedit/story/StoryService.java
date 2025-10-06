package se.hjulverkstan.main.feature.webedit.story;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.feature.webedit.localisation.FieldNameType;
import se.hjulverkstan.main.feature.webedit.localisation.Language;
import se.hjulverkstan.main.feature.webedit.localisation.LocalisedContentUtils;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class StoryService {

    private final StoryRepository storyRepository;

    public GetAllStoryDto getAllStoriesByLang(Language lang, Language fallbackLang) {
        List<Story> stories = storyRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return new GetAllStoryDto(stories, lang, fallbackLang);
    }

    public StoryDto getStoryByLangAndId(Language lang, Long id) {
        Story story = storyRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Story"));
        return new StoryDto(story, lang, null);
    }

    @Transactional
    public StoryDto createStoryByLang(Language lang, StoryDto dto) {
        Story story = dto.applyToEntity(new Story());

        LocalisedContentUtils.upsertLocalisedContent(
                story,
                lang,
                dto.getBodyText(),
                FieldNameType.BODY_TEXT,
                lc -> lc.setStory(story)
        );

        storyRepository.save(story);
        return new StoryDto(story, lang, null);
    }

    @Transactional
    public StoryDto editStoryByLang(Language lang, Long id, StoryDto dto) {
        Story story = storyRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Story"));

        LocalisedContentUtils.upsertLocalisedContent(
                story,
                lang,
                dto.getBodyText(),
                FieldNameType.BODY_TEXT,
                lc -> lc.setStory(story)
        );

        return new StoryDto(story, lang, null);
    }

    @Transactional
    public void deleteStory(Long id) {
        Story story = storyRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Story"));
        storyRepository.delete(story);
    }
}
