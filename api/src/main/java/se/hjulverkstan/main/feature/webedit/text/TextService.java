package se.hjulverkstan.main.feature.webedit.text;

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
public class TextService {

    private final TextRepository textRepository;

    public GetAllTextDto getAllTextsByLang(Language lang, Language fallbackLang) {
        List<Text> texts = textRepository.findAll(Sort.by(Sort.Direction.DESC, "name"));
        return new GetAllTextDto(texts, lang, fallbackLang);
    }

    public TextDto getTextByLangAndId(Language lang, Long id) {
        Text text = textRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Text"));
        return new TextDto(text, lang, null);
    }

    @Transactional
    public TextDto editTextByLang(Language lang, Long id, TextDto dto) {
        Text text = textRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Text"));

        LocalisedContentUtils.upsertLocalisedContent(
                text,
                lang,
                dto.getValue(),
                FieldNameType.VALUE,
                lc -> lc.setText(text)
        );

        textRepository.save(text);
        return new TextDto(text, lang, null);
    }
}
