package se.hjulverkstan.main.service.webedit;

import se.hjulverkstan.main.common.exception.ElementNotFoundException;
import se.hjulverkstan.main.dto.webedit.GeneralContentDto;
import se.hjulverkstan.main.dto.webedit.UpdateGeneralContentWithLangDto;
import se.hjulverkstan.main.model.webedit.Language;

import java.util.List;

public interface GeneralContentService {
    List<GeneralContentDto> getAllGeneralContentsByLang(Language lang);

    GeneralContentDto getGeneralContentByIdAndLang(Long id, Language lang);

    /**
     * Edits or deletes the localized content of a specified GeneralContent entry based on the provided updates.
     * This method updates the localized content if a new value is provided, deletes it if the new value is null,
     * or adds new localized content if it does not already exist for the specified language.
     *
     * @param id The ID of the GeneralContent to edit.
     * @param updateDto DTO containing the updates, including the language and new value for localization.
     * @return GeneralContentDto reflecting the updated or unchanged GeneralContent, depending on the operation performed.
     * @throws ElementNotFoundException if no GeneralContent with the given ID is found.
     */
    GeneralContentDto editGeneralContent(Long id, UpdateGeneralContentWithLangDto updateDto);
}
