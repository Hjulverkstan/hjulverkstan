package se.hjulverkstan.main.feature.webedit.text;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.lang.Nullable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.main.feature.webedit.localisation.Language;
import se.hjulverkstan.main.shared.ListResponseDto;

@RestController
@RequestMapping("v1/api/web-edit/text")
@PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER') or hasRole('ROLE_PIPELINE')")
@RequiredArgsConstructor
public class TextController {

    private final TextService textService;

    @GetMapping()
    public ListResponseDto<TextDto> getAllTexts(@RequestParam @Nullable Language lang) {
        return textService.getAllTextsByLang(lang, null);
    }

    @GetMapping("/{id}")
    public TextDto getText(@PathVariable Long id, @RequestParam @Nullable Language lang) {
        return textService.getTextByLangAndId(id, lang);
    }

    @PutMapping("/{id}")
    public TextDto editText(@PathVariable Long id, @Valid @RequestBody TextDto dto, @RequestParam @Nullable Language lang) {
        return textService.editTextByLang(id, dto, lang);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteStory(@PathVariable Long id, @RequestParam @Nullable Language lang) {
        textService.deleteText(id, lang);
    }
}