package se.hjulverkstan.main.controller.webedit;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.main.dto.webedit.UpdateShopWithLangDto;
import se.hjulverkstan.main.dto.webedit.NewShopWithLangDto;
import se.hjulverkstan.main.dto.webedit.ShopDto;
import se.hjulverkstan.main.model.webedit.Language;
import se.hjulverkstan.main.service.webedit.ShopService;

import java.util.List;

import static se.hjulverkstan.main.util.WebEditUtils.validateLanguage;

@RestController
@RequestMapping("v1/web-edit/shop")
public class ShopController {
    private final ShopService shopService;

    public ShopController(ShopService shopService) {
        this.shopService = shopService;
    }

    @GetMapping()
    public ResponseEntity<List<ShopDto>> getAllShops(@RequestParam(name = "lang") String lang) {
        Language language = validateLanguage(lang);
        return new ResponseEntity<>(shopService.getAllShopsByLang(language), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShopDto> getShop(@PathVariable Long id, @RequestParam(name = "lang") String lang) {
        Language language = validateLanguage(lang);
        return new ResponseEntity<>(shopService.getShopByIdAndLang(id, language), HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ShopDto> deleteShop(@PathVariable Long id) {
        return new ResponseEntity<>(shopService.deleteShop(id), HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<ShopDto> createShop(@Valid @RequestBody NewShopWithLangDto newShop) {
        return new ResponseEntity<>(shopService.createShop(newShop), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShopDto> editShop(@PathVariable Long id, @Valid @RequestBody UpdateShopWithLangDto shop) {
        return new ResponseEntity<>(shopService.editShop(id, shop), HttpStatus.OK);
    }
}
