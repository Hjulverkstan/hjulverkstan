package se.hjulverkstan.main.feature.webedit.shop;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.lang.Nullable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.main.feature.webedit.translation.Language;
import se.hjulverkstan.main.shared.ListResponseDto;

@RestController
@RequestMapping("v1/api/web-edit/shop")
@PreAuthorize("hasRole('ROLE_ADMIN')")
@RequiredArgsConstructor
public class ShopController {
    private final ShopService shopService;

    @GetMapping()
    public ListResponseDto<ShopDto> getAllShops(@RequestParam Language lang) {
        return shopService.getAllShopsByLang(lang);
    }

    @GetMapping("/{id}")
    public ShopDto getShop(@PathVariable Long id, @RequestParam Language lang) {
        return shopService.getShopByLangAndId(id, lang);
    }

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public ShopDto createShop(@Valid @RequestBody ShopDto dto, @RequestParam Language lang) {
        return shopService.createShopByLang(dto, lang);
    }

    @PutMapping("/{id}")
    public ShopDto editShop(@PathVariable Long id, @Valid @RequestBody ShopDto dto, @RequestParam Language lang) {
        return shopService.editShopByLang(id, dto, lang);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteShop(@PathVariable Long id, @RequestParam Language lang) {
        shopService.deleteShop(id, lang);
    }
}
