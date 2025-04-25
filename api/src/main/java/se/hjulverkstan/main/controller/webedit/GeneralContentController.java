package se.hjulverkstan.main.controller.webedit;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.main.dto.webedit.GeneralContentDto;
import se.hjulverkstan.main.dto.webedit.UpdateGeneralContentWithLangDto;
import se.hjulverkstan.main.model.webedit.Language;
import se.hjulverkstan.main.service.webedit.GeneralContentService;

import java.util.List;

import static se.hjulverkstan.main.util.WebEditUtils.validateLanguage;

@RestController
@RequestMapping("v1/api/web-edit/general-content")
@PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER') or hasRole('ROLE_PIPELINE')")
public class GeneralContentController {
    private final GeneralContentService generalContentService;

    public GeneralContentController(GeneralContentService generalContentService) {
        this.generalContentService = generalContentService;
    }

    @GetMapping()
    public ResponseEntity<List<GeneralContentDto>> getAllGeneralContents(@RequestParam(name = "lang") String lang) {
        Language language = validateLanguage(lang);
        return new ResponseEntity<>(generalContentService.getAllGeneralContentsByLang(language), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GeneralContentDto> getGeneralContent(@PathVariable Long id, @RequestParam(name = "lang") String lang) {
        Language language = validateLanguage(lang);
        return new ResponseEntity<>(generalContentService.getGeneralContentByIdAndLang(id, language), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GeneralContentDto> editGeneralContent(@PathVariable Long id, @Valid @RequestBody UpdateGeneralContentWithLangDto entry) {
        return new ResponseEntity<>(generalContentService.editGeneralContent(id, entry), HttpStatus.OK);
    }
}