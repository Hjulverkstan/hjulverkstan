package se.hjulverkstan.main.service.webedit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.common.exception.ElementNotFoundException;
import se.hjulverkstan.main.dto.webedit.GeneralContentDto;
import se.hjulverkstan.main.dto.webedit.UpdateGeneralContentWithLangDto;
import se.hjulverkstan.main.model.webedit.FieldNameType;
import se.hjulverkstan.main.model.webedit.GeneralContent;
import se.hjulverkstan.main.model.webedit.Language;
import se.hjulverkstan.main.model.webedit.LocalisedContent;
import se.hjulverkstan.main.repository.webedit.GeneralContentRepository;

import java.util.List;

@Service
@Transactional
public class GeneralContentServiceImpl implements GeneralContentService {
    private final GeneralContentRepository generalContentRepository;

    @Autowired
    public GeneralContentServiceImpl(GeneralContentRepository generalContentRepository) {
        this.generalContentRepository = generalContentRepository;
    }

    @Override
    public List<GeneralContentDto> getAllGeneralContentsByLang(Language lang) {
        return generalContentRepository.findAll(Sort.by(Sort.Direction.ASC, "name")).stream()
                .map(gc -> mapToGeneralContentDto(gc, lang))
                .toList();
    }

    @Override
    public GeneralContentDto getGeneralContentByIdAndLang(Long id, Language lang) {
        return generalContentRepository.findById(id)
                .map(gc -> mapToGeneralContentDto(gc, lang))
                .orElseThrow(() -> new ElementNotFoundException("General Content " + id));
    }

    @Override
    public GeneralContentDto editGeneralContent(Long id, UpdateGeneralContentWithLangDto updateDto) {
        GeneralContent selectedGeneralContent = generalContentRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException("General Content " + id));

        String newValue = updateDto.getUpdateGeneralContentDto().getValue();
        Language lang = updateDto.getLang();

        LocalisedContent localisedContent = selectedGeneralContent.getLocalisedContent().stream()
                .filter(lc -> lc.getLang() != null && lc.getLang().equals(lang))
                .findFirst()
                .orElse(null);

        // If new value is null delete the LocalisedContent if it exists
        if (newValue == null) {
            if (localisedContent != null) {
                selectedGeneralContent.getLocalisedContent().remove(localisedContent);
                generalContentRepository.save(selectedGeneralContent);
                return mapToGeneralContentDto(selectedGeneralContent, lang);
            }

            return mapToGeneralContentDto(selectedGeneralContent, lang);
        }

        if (localisedContent != null) {
            // If value is changed, set new value otherwise return the original.
            if (!newValue.equals(localisedContent.getContent())) {
                localisedContent.setContent(newValue);
                generalContentRepository.save(selectedGeneralContent);
            }
        } else {
            // Create new LocalisedContent with value since it didn't exist.
            LocalisedContent lc = new LocalisedContent();
            lc.setLang(updateDto.getLang());
            lc.setFieldName(FieldNameType.VALUE);
            lc.setContent(newValue);
            lc.setGeneralContent(selectedGeneralContent);

            selectedGeneralContent.getLocalisedContent().add(lc);
            generalContentRepository.save(selectedGeneralContent);
        }
        return mapToGeneralContentDto(selectedGeneralContent, lang);
    }

    /**
     * Maps a GeneralContent entity to a GeneralContentDto, including localized content for the specified language.
     * Localized content is included if available; otherwise, the value is set to null.
     *
     * @param generalContent The GeneralContent entity to convert.
     * @param lang           The ISO 639-2 language code for filtering the localized content.
     * @return A populated GeneralContentDto with attributes and localized content based on availability.
     */
    private GeneralContentDto mapToGeneralContentDto(GeneralContent generalContent, Language lang) {
        GeneralContentDto gcDto = new GeneralContentDto();
        gcDto.setId(generalContent.getId());
        gcDto.setTextType(generalContent.getTextType());
        gcDto.setName(generalContent.getName());
        gcDto.setDescription(generalContent.getDescription());
        gcDto.setKey(generalContent.getKey());

        // Retrieve localised for the specified language or return null
        String localisedValue = generalContent.getLocalisedContent().stream()
                .filter(lc -> lc.getLang() != null && lc.getLang().equals(lang))
                .findFirst()
                .map(LocalisedContent::getContent)
                .orElse(null);

        gcDto.setValue(localisedValue);

        return gcDto;
    }
}
