package se.hjulverkstan.main.controller.webedit;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import se.hjulverkstan.main.dto.webedit.LangCountPerEntityDto;
import se.hjulverkstan.main.service.webedit.LangCountService;

@RestController
@RequestMapping("v1/web-edit/count")
public class LangCountController {
    private final LangCountService langCountService;

    public LangCountController(LangCountService langCountService) {
        this.langCountService = langCountService;
    }

    @GetMapping()
    public ResponseEntity<LangCountPerEntityDto> getEntityLangCount(@RequestParam String entity) {
        return new ResponseEntity<>(langCountService.getLangCountByEntity(entity), HttpStatus.OK);
    }
}
