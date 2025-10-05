package se.hjulverkstan.main.feature.webedit.shop;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.error.exceptions.DataViolationException;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.feature.location.Location;
import se.hjulverkstan.main.feature.webedit.localisation.FieldNameType;
import se.hjulverkstan.main.feature.webedit.localisation.Language;
import se.hjulverkstan.main.feature.webedit.localisation.LocalisedContent;
import se.hjulverkstan.main.feature.location.LocationRepository;
import se.hjulverkstan.main.feature.webedit.localisation.LocalisedContentUtils;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ShopService {

    private final ShopRepository shopRepository;
    private final LocationRepository locationRepository;

    public GetAllShopDto getAllShopsByLang(Language lang, Language fallBackLang) {
        List<Shop> shops = shopRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return new GetAllShopDto(shops, lang, fallBackLang);
    }

    public ShopDto getShopByLangAndId(Language lang, Long id) {
        Shop shop = shopRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Shop"));
        return new ShopDto(shop, lang, null);
    }

    @Transactional
    public ShopDto createShopByLang(Language lang, ShopDto dto) {
        Shop shop = dto.applyToEntity(new Shop());
        applyRelationsFromDto(dto, shop);

        LocalisedContentUtils.upsertLocalisedContent(
               shop,
               lang,
               dto.getBodyText(),
                FieldNameType.BODY_TEXT,
                lc -> lc.setShop(shop)
        );

        shopRepository.save(shop);

        return new ShopDto(shop, lang, null);
    }

    @Transactional
    public ShopDto editShopByLang(Language lang, Long id, ShopDto dto) {
        Shop shop = shopRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Shop"));

        dto.applyToEntity(shop);
        applyRelationsFromDto(dto, shop);

        LocalisedContentUtils.upsertLocalisedContent(
                shop,
                lang,
                dto.getBodyText(),
                FieldNameType.BODY_TEXT,
                lc -> lc.setShop(shop)
        );

        shopRepository.save(shop);
        return new ShopDto(shop, lang, null);
    }

    @Transactional
    public void deleteShop(Long id) {
        Shop shop = shopRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Shop"));
        shopRepository.delete(shop);
    }

    private void applyRelationsFromDto (ShopDto dto, Shop shop) {
        Location location = locationRepository.findById(dto.getLocationId())
                .orElseThrow(() -> new ElementNotFoundException("Location"));

        shop.setLocation(location);
    }
}
