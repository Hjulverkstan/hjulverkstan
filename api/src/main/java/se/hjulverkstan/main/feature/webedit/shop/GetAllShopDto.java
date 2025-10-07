package se.hjulverkstan.main.feature.webedit.shop;

import lombok.Getter;

import java.util.List;
import java.util.function.Function;

@Getter
public class GetAllShopDto {
    private List<ShopDto> shops;

    public GetAllShopDto (List<Shop> shops, Function<Shop, ShopDto> mapper) {
        this.shops = shops.stream().map(mapper).toList();
    }
}
