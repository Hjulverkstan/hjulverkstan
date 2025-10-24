package se.hjulverkstan.main.feature.webedit.shop;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.feature.location.Location;
import se.hjulverkstan.main.feature.location.LocationRepository;
import se.hjulverkstan.main.feature.webedit.localisation.FieldName;
import se.hjulverkstan.main.feature.webedit.localisation.Language;
import se.hjulverkstan.main.feature.webedit.localisation.LocalisationService;
import se.hjulverkstan.main.shared.ListResponseDto;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ShopService {

    private final ShopRepository shopRepository;
    private final LocationRepository locationRepository;
    private final LocalisationService localisationService;

    public ListResponseDto<ShopDto> getAllShopsByLang(Language lang, Language fallbackLang) {
        List<Shop> shops = shopRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));

        return new ListResponseDto<>(shops.stream().map(shop -> toDto(shop, lang, fallbackLang)).toList());
    }

    public ShopDto getShopByLangAndId(Language lang, Long id) {
        Shop shop = shopRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Shop"));
        return toDto(shop, lang, null);
    }

    @Transactional
    public ShopDto createShopByLang(Language lang, ShopDto dto) {
        Shop shop = new Shop();

        applyToEntity(shop, dto, lang);
        shopRepository.save(shop);

        return toDto(shop, lang, null);
    }

    @Transactional
    public ShopDto editShopByLang(Language lang, Long id, ShopDto dto) {
        Shop shop = shopRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Shop"));

        applyToEntity(shop, dto, lang);
        shopRepository.save(shop);

        return toDto(shop, lang, null);
    }

    @Transactional
    public void deleteShop(Long id) {
        Shop shop = shopRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Shop"));
        shopRepository.delete(shop);
    }

    private void applyToEntity (Shop shop, ShopDto dto, Language lang) {
        Location location = locationRepository.findById(dto.getLocationId())
                .orElseThrow(() -> new ElementNotFoundException("Location"));

        dto.applyToEntity(shop, location);

        localisationService.upsertRichText(
                shop,
                lang,
                dto.getBodyText(),
                FieldName.BODY_TEXT,
                lc -> lc.setShop(shop)
        );
    }

    private ShopDto toDto (Shop shop, Language lang, Language fallbackLang) {
        JsonNode bodyText = localisationService.getRichText(shop, FieldName.BODY_TEXT, lang, fallbackLang);
        return new ShopDto(shop, bodyText);
    }
}
