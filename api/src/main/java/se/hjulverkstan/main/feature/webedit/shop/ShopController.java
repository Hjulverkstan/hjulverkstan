package se.hjulverkstan.main.feature.webedit.shop;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.main.shared.ListResponseDto;

@RestController
@RequestMapping("v1/api/web-edit/shop")
@PreAuthorize("hasRole('ROLE_ADMIN')")
@RequiredArgsConstructor
public class ShopController {
    private final ShopService shopService;

    @GetMapping()
    public ListResponseDto<ShopDto> getAllShops() {
        return shopService.getAllShops();
    }

    @GetMapping("/{id}")
    public ShopDto getShop(@PathVariable Long id) {
        return shopService.getShopById(id);
    }

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public ShopDto createShop(@Valid @RequestBody ShopDto dto) {
        return shopService.createShop(dto);
    }

    @PutMapping("/{id}")
    public ShopDto editShop(@PathVariable Long id, @Valid @RequestBody ShopDto dto) {
        return shopService.editShop(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteShop(@PathVariable Long id) {
        shopService.deleteShop(id);
    }
}
