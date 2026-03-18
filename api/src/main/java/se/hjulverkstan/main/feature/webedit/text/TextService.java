package se.hjulverkstan.main.feature.webedit.text;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.error.exceptions.MissingArgumentException;
import se.hjulverkstan.main.error.exceptions.UnsupportedArgumentException;
import se.hjulverkstan.main.feature.webedit.translation.FieldName;
import se.hjulverkstan.main.feature.webedit.translation.Language;
import se.hjulverkstan.main.feature.webedit.translation.TranslationService;
import se.hjulverkstan.main.shared.ListResponseDto;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class TextService {

    private final TextRepository textRepository;
    private final TranslationService translationService;

    public ListResponseDto<TextDto> getAllTextsByLang(Language lang) {
        List<Text> texts = textRepository.findAll(Sort.by(Sort.Direction.DESC, "key"));

        return new ListResponseDto<>(texts.stream().map(text -> toDto(text, lang, false)).toList());

    }

    public TextDto getTextByLangAndId(Long id, Language lang) {
        Text text = textRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Text"));

        return toDto(text, lang, false);
    }

    @Transactional
    public TextDto editTextByLang(Long id, TextDto dto, Language lang) {
        Text text = textRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Text"));

        applyToEntity(text, dto, lang);
        textRepository.save(text);

        return toDto(text, lang, false);
    }

    @Transactional
    public void deleteText(Long id, Language lang) {
        Text text = textRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Text"));

        if (lang == Language.SV) {
            throw new UnsupportedArgumentException("Cannot delete a text, only translations (non-default language)");
        }

        translationService.removeTranslationsByLang(text.getIdentityId(), lang);
        textRepository.save(text);
    }

    private void applyToEntity (Text text, TextDto dto, Language lang) {
        translationService.upsertText(
                text.getIdentityId(),
                lang,
                dto.getValue(),
                FieldName.VALUE
        );
    }

    private TextDto toDto (Text text, Language lang, boolean fallback) {
        String value = translationService.getText(text.getIdentityId(), FieldName.VALUE, lang, fallback);
        return new TextDto(text, value);
    }
}
