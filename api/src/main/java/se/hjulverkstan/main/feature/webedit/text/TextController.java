package se.hjulverkstan.main.feature.webedit.text;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.main.feature.webedit.localisation.Language;

@RestController
@RequestMapping("v1/api/web-edit/general-content")
@PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER') or hasRole('ROLE_PIPELINE')")
@RequiredArgsConstructor
public class TextController {

    private final TextService textService;

    @GetMapping("/{lang}")
    public GetAllTextDto getAllTexts(@PathVariable Language lang) {
        return textService.getAllTextsByLang(lang, null);
    }

    @GetMapping("/{lang}/{id}")
    public TextDto getText(@PathVariable Language lang, @PathVariable Long id) {
        return textService.getTextByLangAndId(lang, id);
    }

    @PutMapping("/{lang}/{id}")
    public TextDto editText(@PathVariable Language lang, @PathVariable Long id, @Valid @RequestBody TextDto dto) {
        return textService.editTextByLang(lang, id, dto);
    }
}