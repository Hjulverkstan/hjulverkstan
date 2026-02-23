package se.hjulverkstan.main.feature.webedit.story;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.feature.webedit.WebEditEntity;
import se.hjulverkstan.main.feature.webedit.localisation.FieldName;
import se.hjulverkstan.main.feature.webedit.localisation.Language;
import se.hjulverkstan.main.feature.webedit.localisation.LocalisationService;
import se.hjulverkstan.main.feature.webedit.releases.ReleaseService;
import se.hjulverkstan.main.shared.ListResponseDto;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class StoryService {

    private final StoryRepository storyRepository;
    private final LocalisationService localisationService;
    private final ReleaseService releaseService;

    public ListResponseDto<StoryDto> getAllStoriesByLang(Language lang, Language fallbackLang) {
        List<Story> stories = storyRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));

        return new ListResponseDto<>(stories.stream().map(story -> toDto(story, lang, fallbackLang)).toList());
    }

    public StoryDto getStoryByLangAndId(Long id, Language lang) {
        Story story = storyRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Story"));

        return toDto(story, lang, null);
    }

    @Transactional
    public StoryDto createStory(StoryDto dto) {
        Story story = releaseService.attachIdentity(WebEditEntity.STORY, new Story());
        dto.applyToEntity(story);
        storyRepository.save(story);

        return new StoryDto(story, null);
    }

    @Transactional
    public StoryDto editStoryByLang(Long id, StoryDto dto, Language lang) {
        Story story = storyRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Story"));

        if (lang == null) {
            story = story.isNotPublished() ? story : new Story(story);
            dto.applyToEntity(story);
            storyRepository.save(story);
        } else {
            localisationService.upsertRichText(
                    story.getIdentityId(),
                    lang,
                    dto.getBodyText(),
                    FieldName.BODY_TEXT
            );
        }

        return toDto(story, lang, null);
    }

    @Transactional
    public void deleteStory(Long id, Language lang) {
        Story story = storyRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Story"));

        if (lang == null) {
            if (story.isNotPublished()) {
                storyRepository.delete(story);
            } else {
                story.setDeleted(true);
                storyRepository.save(story);
            }
        } else {
            releaseService.deleteTranslationSet(story.getIdentityId(), lang);
        }
    }

    private StoryDto toDto (Story story, Language lang, @Nullable Language fallbackLang) {
        JsonNode bodyText = localisationService.getRichText(story.getIdentityId(), FieldName.BODY_TEXT, lang, fallbackLang);
        return new StoryDto(story, bodyText);
    }
}
