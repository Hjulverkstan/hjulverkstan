package se.hjulverkstan.main.controller.webedit;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.main.dto.webedit.AllWebEditEntitiesByLangDto;
import se.hjulverkstan.main.model.webedit.Language;
import se.hjulverkstan.main.service.webedit.LocalisationServiceImpl;

import static se.hjulverkstan.main.util.WebEditUtils.validateLanguage;

@RestController
@RequestMapping("v1/webedit")
public class LocalisationController {
    LocalisationServiceImpl localizedContentAndShopServiceImpl;

    public LocalisationController(LocalisationServiceImpl localizedContentAndShopServiceImpl) {
        this.localizedContentAndShopServiceImpl = localizedContentAndShopServiceImpl;
    }

    @GetMapping("get-all")
    public ResponseEntity<AllWebEditEntitiesByLangDto> getAllLocalisedContentWithFallbackLang(@RequestParam String fallbackLang) {
        Language fallbackLangValidated = validateLanguage(fallbackLang);
        return new ResponseEntity<>(localizedContentAndShopServiceImpl.getAllLocalisedEntitiesWithFallback(fallbackLangValidated), HttpStatus.OK);
    }
}