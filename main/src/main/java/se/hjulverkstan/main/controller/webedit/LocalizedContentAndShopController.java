package se.hjulverkstan.main.controller.webedit;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.main.dto.webedit.AllWebEditEntitiesByLangDto;
import se.hjulverkstan.main.model.webedit.Language;
import se.hjulverkstan.main.service.webedit.LocalizedContentAndShopServiceImpl;

import static se.hjulverkstan.main.util.WebEditUtils.validateLanguage;

@RestController
@RequestMapping("v1/get-all")
public class LocalizedContentAndShopController {
    LocalizedContentAndShopServiceImpl localizedContentAndShopServiceImpl;

    public LocalizedContentAndShopController(LocalizedContentAndShopServiceImpl localizedContentAndShopServiceImpl) {
        this.localizedContentAndShopServiceImpl = localizedContentAndShopServiceImpl;
    }

    @GetMapping()
    public ResponseEntity<AllWebEditEntitiesByLangDto> getAll(@RequestParam String fallbackLang){
        Language language = validateLanguage(fallbackLang);
        return new  ResponseEntity<>(localizedContentAndShopServiceImpl.getAllLocalisedData(language), HttpStatus.OK);
    }
}