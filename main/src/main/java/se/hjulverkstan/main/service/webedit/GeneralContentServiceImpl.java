package se.hjulverkstan.main.service.webedit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.Exceptions.ElementNotFoundException;
import se.hjulverkstan.main.dto.webedit.GeneralContentDto;
import se.hjulverkstan.main.dto.webedit.GeneralContentUpdateDto;
import se.hjulverkstan.main.model.webedit.FieldNameType;
import se.hjulverkstan.main.model.webedit.GeneralContent;
import se.hjulverkstan.main.model.webedit.Language;
import se.hjulverkstan.main.model.webedit.LocalisedContent;
import se.hjulverkstan.main.repository.webedit.GeneralContentRepository;
import se.hjulverkstan.main.repository.webedit.LocalisedContentRepository;

import java.util.List;

@Service
@Transactional
public class GeneralContentServiceImpl implements GeneralContentService {
    private final GeneralContentRepository generalContentRepository;
    private final LocalisedContentRepository localisedContentRepository;

    @Autowired
    public GeneralContentServiceImpl(GeneralContentRepository generalContentRepository, LocalisedContentRepository localisedContentRepository) {
        this.generalContentRepository = generalContentRepository;
        this.localisedContentRepository = localisedContentRepository;
    }

    @Override
    public List<GeneralContentDto> getAllGeneralContentsByLang(Language lang) {
        List<GeneralContent> generalContentList = generalContentRepository.findAll(Sort.by(Sort.Direction.ASC, "name"));

        return generalContentList.stream()
                .map(gc -> mapToGeneralContentDto(gc, lang))
                .toList();
    }

    @Override
    public GeneralContentDto getGeneralContentByIdAndLang(Long id, Language lang) {
        GeneralContent generalContent = generalContentRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException("General Content " + id));

        return mapToGeneralContentDto(generalContent, lang);
    }

    @Override
    public GeneralContentDto editGeneralContent(Long id, GeneralContentUpdateDto updateDto) {
        GeneralContent selectedGeneralContent = generalContentRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException("General Content " + id));

        String newValue = updateDto.getLocalisationUpdateDto().getValue();
        Language lang = updateDto.getLang();

        LocalisedContent localisedContent = selectedGeneralContent.getLocalisedContent().stream()
                .filter(lc -> lc.getLang() != null && lc.getLang().equals(lang))
                .findFirst()
                .orElse(null);

        // If new value is null delete the LocalisedContent if it exists
        if (newValue == null) {
            if (localisedContent != null) {
                localisedContentRepository.delete(localisedContent);
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
            lc.setRefType("GeneralContent");
            lc.setRefId(selectedGeneralContent.getId());
            lc.setLang(updateDto.getLang());
            lc.setFieldName(FieldNameType.VALUE);
            lc.setContent(newValue);

            selectedGeneralContent.getLocalisedContent().add(lc);
            localisedContentRepository.save(lc);
            generalContentRepository.save(selectedGeneralContent);

        }
        return mapToGeneralContentDto(selectedGeneralContent, lang);
    }

    /**
     * Converts a GeneralContent entity to a GeneralContentDto, including localized content for the specified language.
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
        String localisedContent = generalContent.getLocalisedContent().stream()
                .filter(lc -> lc.getLang() != null && lc.getLang().equals(lang))
                .findFirst()
                .map(LocalisedContent::getContent)
                .orElse(null);

        gcDto.setValue(localisedContent);

        return gcDto;
    }
}
