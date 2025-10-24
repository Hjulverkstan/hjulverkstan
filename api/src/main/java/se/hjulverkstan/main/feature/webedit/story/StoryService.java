package se.hjulverkstan.main.feature.webedit.story;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.feature.webedit.localisation.FieldName;
import se.hjulverkstan.main.feature.webedit.localisation.Language;
import se.hjulverkstan.main.feature.webedit.localisation.LocalisationService;
import se.hjulverkstan.main.shared.ListResponseDto;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class StoryService {

    private final StoryRepository storyRepository;
    private final LocalisationService localisationService;

    public ListResponseDto<StoryDto> getAllStoriesByLang(Language lang, Language fallbackLang) {
        List<Story> stories = storyRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));

        return new ListResponseDto<>(stories.stream().map(story -> toDto(story, lang, fallbackLang)).toList());
    }

    public StoryDto getStoryByLangAndId(Language lang, Long id) {
        Story story = storyRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Story"));

        return toDto(story, lang, null);
    }

    @Transactional
    public StoryDto createStoryByLang(Language lang, StoryDto dto) {
        Story story = new Story();

        applyToEntity(story, dto, lang);
        storyRepository.save(story);

        return toDto(story, lang, null);
    }

    @Transactional
    public StoryDto editStoryByLang(Language lang, Long id, StoryDto dto) {
        Story story = storyRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Story"));

        applyToEntity(story, dto, lang);
        storyRepository.save(story);

        return toDto(story, lang, null);
    }

    @Transactional
    public void deleteStory(Long id) {
        Story story = storyRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Story"));
        storyRepository.delete(story);
    }

    private void applyToEntity (Story story, StoryDto dto, Language lang) {
        dto.applyToEntity(story);

        localisationService.upsertText(
                story,
                lang,
                dto.getTitle(),
                FieldName.TITLE,
                lc -> lc.setStory(story)
        );

        localisationService.upsertRichText(
                story,
                lang,
                dto.getBodyText(),
                FieldName.BODY_TEXT,
                lc -> lc.setStory(story)
        );
    }

    private StoryDto toDto (Story story, Language lang, @Nullable Language fallbackLang) {
        JsonNode bodyText = localisationService.getRichText(story, FieldName.BODY_TEXT, lang, fallbackLang);
        String title = localisationService.getText(story, FieldName.TITLE, lang, fallbackLang);
        return new StoryDto(story, title,  bodyText);
    }
}
