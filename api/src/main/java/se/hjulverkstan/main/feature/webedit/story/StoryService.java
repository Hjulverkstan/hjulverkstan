package se.hjulverkstan.main.feature.webedit.story;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.error.exceptions.UnsupportedArgumentException;
import se.hjulverkstan.main.feature.webedit.WebEditEntity;
import se.hjulverkstan.main.feature.webedit.release.Identity;
import se.hjulverkstan.main.feature.webedit.release.IdentityRepository;
import se.hjulverkstan.main.feature.webedit.translation.FieldName;
import se.hjulverkstan.main.feature.webedit.translation.Language;
import se.hjulverkstan.main.feature.webedit.translation.TranslationService;
import se.hjulverkstan.main.shared.ListResponseDto;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class StoryService {

    private final StoryRepository storyRepository;
    private final IdentityRepository identityRepository;
    private final TranslationService translationService;

    public ListResponseDto<StoryDto> getAllStoriesByLang(Language lang) {
        List<Story> stories = storyRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));

        return new ListResponseDto<>(stories.stream().map(story -> toDto(story, lang, false)).toList());
    }

    public StoryDto getStoryByLangAndId(Long id, Language lang) {
        Story story = storyRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Story"));

        return toDto(story, lang, false);
    }

    @Transactional
    public StoryDto createStoryByLang(StoryDto dto, Language lang) {
        if (lang != Language.SV) throw new UnsupportedArgumentException("Create has to be in default language");

        Identity identity = identityRepository.save(new Identity(WebEditEntity.STORY));

        Story story = new Story();
        story.setIdentityId(identity.getId());
        applyToEntity(story, dto, lang);
        storyRepository.save(story);

        return toDto(story, lang, false);
    }

    @Transactional
    public StoryDto editStoryByLang(Long id, StoryDto dto, Language lang) {
        Story story = storyRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Story"));

        applyToEntity(story, dto, lang);
        storyRepository.save(story);

        return toDto(story, lang, false);
    }

    @Transactional
    public void deleteStory(Long id, Language lang) {
        Story story = storyRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Story"));

        if (lang != Language.SV) {
            translationService.removeTranslationsByLang(story.getIdentityId(), lang);
            storyRepository.save(story);
        } else {
            if (translationService.hasNonDefaultLangTranslations(story.getIdentityId())) {
                throw new UnsupportedArgumentException("Tried to delete story (lang = default lang) but has other translations");
            }

            Identity identity = identityRepository.findById(story.getIdentityId()).orElseThrow(() -> new ElementNotFoundException("Story"));
            identityRepository.delete(identity);

            translationService.removeTranslationsByLang(story.getIdentityId(), lang);

            storyRepository.delete(story);
        }
    }

    private void applyToEntity (Story story, StoryDto dto, Language lang) {
        dto.applyToEntity(story);

        translationService.upsertText(story.getIdentityId(), lang, dto.getTitle(), FieldName.TITLE);
        translationService.upsertRichText( story.getIdentityId(), lang, dto.getBodyText(), FieldName.BODY_TEXT);
    }

    private StoryDto toDto (Story story, Language lang, boolean fallback) {
        String title = translationService.getText(story.getIdentityId(), FieldName.TITLE, lang,  fallback);
        JsonNode bodyText = translationService.getRichText(story.getIdentityId(), FieldName.BODY_TEXT, lang, fallback);
        return new StoryDto(story, title, bodyText);
    }
}
