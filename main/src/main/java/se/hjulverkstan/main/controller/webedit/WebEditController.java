package se.hjulverkstan.main.controller.webedit;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.Exceptions.UnsupportedArgumentException;
import se.hjulverkstan.main.dto.webedit.GeneralContentDto;
import se.hjulverkstan.main.dto.webedit.GeneralContentUpdateDto;
import se.hjulverkstan.main.model.webedit.Language;
import se.hjulverkstan.main.service.webedit.GeneralContentService;

import java.util.List;

@RestController
@RequestMapping("v1/web-edit")
public class WebEditController {
    private final GeneralContentService generalContentService;

    public WebEditController(GeneralContentService generalContentService) {
        this.generalContentService = generalContentService;
    }

    @GetMapping("/general-content")
    public ResponseEntity<List<GeneralContentDto>> getAllGeneralContents(@RequestParam(name = "lang") String lang) {
        Language language = validateLanguage(lang);
        return new ResponseEntity<>(generalContentService.getAllGeneralContentsByLang(language), HttpStatus.OK);
    }

    @GetMapping("/general-content/{id}")
    public ResponseEntity<GeneralContentDto> getGeneralContent(@PathVariable Long id, @RequestParam(name = "lang") String lang) {
        Language language = validateLanguage(lang);
        return new ResponseEntity<>(generalContentService.getGeneralContentByIdAndLang(id, language), HttpStatus.OK);
    }

    @PutMapping("/general-content/{id}")
    public ResponseEntity<GeneralContentDto> editGeneralContent(@PathVariable Long id, @RequestBody GeneralContentUpdateDto entry) {
        return new ResponseEntity<>(generalContentService.editGeneralContent(id, entry), HttpStatus.OK);
    }

    private Language validateLanguage(String lang) {
        try {
            return Language.valueOf(lang.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new UnsupportedArgumentException("Invalid language code: " + lang);
        }
    }
}