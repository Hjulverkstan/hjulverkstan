package se.hjulverkstan.main.feature.webedit.shop;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.main.feature.webedit.localisation.Language;

@RestController
@RequestMapping("v1/api/web-edit/shop")
@PreAuthorize("hasRole('ROLE_ADMIN')")
@RequiredArgsConstructor
public class ShopController {
    private final ShopService shopService;

    @GetMapping("/{lang}")
    public GetAllShopDto getAllShops(@PathVariable Language lang) {
        return shopService.getAllShopsByLang(lang, lang);
    }

    @GetMapping("/{lang}/{id}")
    public ShopDto getShop(@PathVariable Language lang, @PathVariable Long id) {
        return shopService.getShopByLangAndId(lang, id);
    }

    @PostMapping("/{lang}")
    @ResponseStatus(HttpStatus.CREATED)
    public ShopDto createShop(@PathVariable Language lang, @Valid @RequestBody ShopDto dto) {
        return shopService.createShopByLang(lang, dto);
    }

    @PutMapping("/{id}")
    public ShopDto editShop(@PathVariable Language lang, @PathVariable Long id, @Valid @RequestBody ShopDto dto) {
        return shopService.editShopByLang(lang, id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteShop(@PathVariable Long id) {
        shopService.deleteShop(id);
    }
}
