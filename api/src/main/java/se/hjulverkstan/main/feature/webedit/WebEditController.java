package se.hjulverkstan.main.feature.webedit;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.main.feature.webedit.localisation.LangCountPerEntityDto;
import se.hjulverkstan.main.feature.webedit.localisation.Language;

@RestController
@RequestMapping("v1/api/web-edit")
@PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER') or hasRole('ROLE_PIPELINE')")
@RequiredArgsConstructor
public class WebEditController {
    private final WebEditService webEditService;

    @GetMapping("get-all")
    public AllWebEditEntitiesByLangDto getAllLocalisedContentWithFallbackLang(@RequestParam Language fallbackLang) {
        return webEditService.getAllLocalisedEntitiesWithFallback(fallbackLang);
    }

    @GetMapping("count/{entity}")
    public LangCountPerEntityDto getEntityLangCount(@PathVariable WebEditEntity entity) {
        return webEditService.getLangCountByEntity(entity);
    }
}