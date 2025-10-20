package se.hjulverkstan.main.feature.webedit.text;

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
public class TextService {

    private final TextRepository textRepository;
    private final LocalisationService localisationService;

    public ListResponseDto<TextDto> getAllTextsByLang(Language lang, Language fallbackLang) {
        List<Text> texts = textRepository.findAll(Sort.by(Sort.Direction.DESC, "name"));

        return new ListResponseDto<>(texts.stream().map(text -> toDto(text, lang, fallbackLang)).toList());

    }

    public TextDto getTextByLangAndId(Language lang, Long id) {
        Text text = textRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Text"));

        return toDto(text, lang, null);
    }

    @Transactional
    public TextDto editTextByLang(Language lang, Long id, TextDto dto) {
        Text text = textRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Text"));

        applyToEntity(text, dto, lang);
        textRepository.save(text);

        return toDto(text, lang, null);
    }

    private void applyToEntity (Text text, TextDto dto, Language lang) {
        localisationService.upsertText(
                text,
                lang,
                dto.getValue(),
                FieldName.VALUE,
                lc -> lc.setText(text)
        );
    }

    private TextDto toDto (Text text, Language lang, @Nullable Language fallbackLang) {
        String value = localisationService.getText(text, FieldName.VALUE, lang, fallbackLang);
        return new TextDto(text, value);
    }
}
