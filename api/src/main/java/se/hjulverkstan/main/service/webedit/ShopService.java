package se.hjulverkstan.main.service.webedit;

import se.hjulverkstan.main.dto.webedit.UpdateShopWithLangDto;
import se.hjulverkstan.main.dto.webedit.NewShopWithLangDto;
import se.hjulverkstan.main.dto.webedit.ShopDto;
import se.hjulverkstan.main.model.webedit.Language;

import java.util.List;

public interface ShopService {
    List<ShopDto> getAllShopsByLang(Language language);

    ShopDto getShopByIdAndLang(Long id, Language language);

    ShopDto deleteShop(Long id);

    ShopDto createShop(NewShopWithLangDto newShop);

    ShopDto editShop(Long id, UpdateShopWithLangDto request);
}
