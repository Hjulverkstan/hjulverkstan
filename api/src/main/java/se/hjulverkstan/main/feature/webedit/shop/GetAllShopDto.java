package se.hjulverkstan.main.feature.webedit.shop;

import lombok.Getter;
import se.hjulverkstan.main.feature.webedit.localisation.Language;

import java.util.List;

@Getter
public class GetAllShopDto {
    private List<ShopDto> shops;

    public GetAllShopDto (List<Shop> shops, Language lang, Language fallbackLang) {
        this.shops = shops.stream().map(shop -> new ShopDto(shop, lang, fallbackLang)).toList();
    }
}
