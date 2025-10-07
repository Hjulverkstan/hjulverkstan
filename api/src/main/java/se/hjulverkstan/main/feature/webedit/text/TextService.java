package se.hjulverkstan.main.feature.webedit.text;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.feature.webedit.localisation.FieldNameType;
import se.hjulverkstan.main.feature.webedit.localisation.Language;
import se.hjulverkstan.main.feature.webedit.localisation.LocalisedContentUtils;
import se.hjulverkstan.main.feature.webedit.shop.Shop;
import se.hjulverkstan.main.feature.webedit.shop.ShopDto;
import se.hjulverkstan.main.shared.ListResponseDto;

import java.util.List;
import java.util.function.Function;

import static se.hjulverkstan.main.feature.webedit.localisation.LocalisedContentUtils.getLocalisedValue;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class TextService {

    private final TextRepository textRepository;

    public ListResponseDto<TextDto> getAllTextsByLang(Language lang, Language fallbackLang) {
        List<Text> texts = textRepository.findAll(Sort.by(Sort.Direction.DESC, "name"));

        Function<Text, TextDto> mapper = text -> new TextDto(text, getLocalisedValue(text, lang, fallbackLang));
        return new ListResponseDto<>(texts.stream().map(mapper).toList());

    }

    public TextDto getTextByLangAndId(Language lang, Long id) {
        Text text = textRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Text"));

        return new TextDto(text, getLocalisedValue(text, lang));
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

        return new TextDto(text, getLocalisedValue(text, lang));
    }
}
