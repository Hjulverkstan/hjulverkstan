package se.hjulverkstan.main.service.webedit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.Exceptions.DataViolationException;
import se.hjulverkstan.Exceptions.ElementNotFoundException;
import se.hjulverkstan.main.dto.webedit.*;
import se.hjulverkstan.main.model.webedit.*;
import se.hjulverkstan.main.repository.webedit.StoryRepository;

import java.util.List;
@Service
@Transactional
public class StoryServiceImpl implements StoryService {
   private final StoryRepository storyRepository;

    @Autowired
    public StoryServiceImpl(StoryRepository storyRepository) {
        this.storyRepository = storyRepository;
    }

    @Override
    public List<StoryDto> getAllStoriesByLang(Language lang) {
        List<Story> storyList = storyRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));

        return storyList.stream().map(story -> mapStoryToDto(story, lang))
                .toList();
    }

    @Override
    public StoryDto getStoryByIdAndLang(Long id, Language lang) {
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException("Story with id" + id));
        return mapStoryToDto(story, lang);
    }

    @Override
    public StoryDto deleteStory(Long id) {
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException("Story with id" + id));

        StoryDto storyDto = mapStoryToDto(story, Language.ENG);
        storyRepository.delete(story);
        return storyDto;
    }

    @Override
    public StoryDto createStory(NewStoryWithLangDto newStoryWithLangDto) {
        NewStoryDto storyDto = newStoryWithLangDto.getNewStoryDto();
        Story story = new Story();

        story.setTitle(storyDto.getTitle());
        story.setImageURL(storyDto.getImageURL());
        story.setBodyText(storyDto.getBodyText());

        LocalisedContent lc = new LocalisedContent();
        lc.setLang(newStoryWithLangDto.getLang());
        lc.setFieldName(FieldNameType.BODY_TEXT);
        lc.setContent(storyDto.getBodyText());
        lc.setStory(story);

        story.getLocalisedContent().add(lc);

        storyRepository.save(story);
        return mapStoryToDto(story, newStoryWithLangDto.getLang());
    }

    @Override
    public StoryDto editStory(Long id, UpdateStoryWithLangDto storyDto) {
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException("Story with id " + id));

        UpdateStoryDto updateStoryDto = storyDto.getUpdateStoryDto();
        Language lang = storyDto.getLang();

        story.setTitle(updateStoryDto.getTitle());
        story.setImageURL(updateStoryDto.getImageURL());
        story.setBodyText(updateStoryDto.getBodyText());

        try {

            String newValue = updateStoryDto.getBodyText();
            LocalisedContent localisedContent = story.getLocalisedContent().stream()
                    .filter(lc -> lc.getLang() != null && lc.getLang().equals(lang))
                    .findFirst()
                    .orElse(null);

            // If new value is null delete the LocalisedContent if it exists
            if (newValue == null) {
                if (localisedContent != null) {
                    story.getLocalisedContent().remove(localisedContent);
                    storyRepository.save(story);
                    return mapStoryToDto(story, lang);
                }

                return mapStoryToDto(story, lang);
            }

            if (localisedContent != null) {
                // if value is changed, set new value otherwise return original
                if (!newValue.equals(localisedContent.getContent())) {
                    localisedContent.setContent(newValue);
                    storyRepository.save(story);
                }
            } else {
                //Create new LocalisedContent with value since no value exists for selected lang
                LocalisedContent lc = new LocalisedContent();
                lc.setLang(lang);
                lc.setFieldName(FieldNameType.BODY_TEXT);
                lc.setContent(newValue);
                lc.setStory(story);

                story.getLocalisedContent().add(lc);

                storyRepository.save(story);
            }
        } catch (DataIntegrityViolationException ex) {
            throw new DataViolationException("Data integrity violation when editing story with id " + id);
        }

        return mapStoryToDto(story, lang);
    }

    private StoryDto mapStoryToDto(Story story, Language lang) {
        StoryDto storyDto = new StoryDto();
        storyDto.setId(story.getId());
        storyDto.setTitle(story.getTitle());
        storyDto.setBodyText(story.getBodyText());
        storyDto.setImageURL(story.getImageURL());

        story.getLocalisedContent().stream()
                .filter(lc -> lc.getLang() != null && lc.getLang().equals(lang))
                .findFirst()
                .map(LocalisedContent::getContent).ifPresent(storyDto::setBodyText);

        return storyDto;
    }
}
