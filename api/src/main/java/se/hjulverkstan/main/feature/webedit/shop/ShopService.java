package se.hjulverkstan.main.feature.webedit.shop;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.error.exceptions.UnsupportedArgumentException;
import se.hjulverkstan.main.feature.location.Location;
import se.hjulverkstan.main.feature.location.LocationRepository;
import se.hjulverkstan.main.feature.webedit.WebEditEntity;
import se.hjulverkstan.main.feature.webedit.release.Identity;
import se.hjulverkstan.main.feature.webedit.release.IdentityRepository;
import se.hjulverkstan.main.feature.webedit.translation.Language;
import se.hjulverkstan.main.feature.webedit.translation.TranslationService;
import se.hjulverkstan.main.shared.ListResponseDto;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ShopService {

    private final ShopRepository shopRepository;
    private final LocationRepository locationRepository;
    private final IdentityRepository identityRepository;
    private final TranslationService translationService;

    public ListResponseDto<ShopDto> getAllShopsByLang(Language lang) {
        List<Shop> shops = shopRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));

        return new ListResponseDto<>(shops.stream().map(this::toDto).toList());
    }

    public ShopDto getShopByLangAndId(Long id, Language lang) {
        Shop shop = shopRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Shop"));
        return toDto(shop);
    }

    @Transactional
    public ShopDto createShopByLang(ShopDto dto, Language lang) {
        if (lang != Language.SV) throw new UnsupportedArgumentException("Create has to be in default language");

        Location location = locationRepository.findById(dto.getLocationId())
                .orElseThrow(() -> new ElementNotFoundException("Location"));

        Identity identity = identityRepository.save(new Identity(WebEditEntity.SHOP));

        Shop shop = new Shop();
        shop.setIdentityId(identity.getId());
        dto.applyToEntity(shop, location);
        shopRepository.save(shop);

        return toDto(shop);
    }

    @Transactional
    public ShopDto editShopByLang(Long id, ShopDto dto, Language lang) {
        Shop shop = shopRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Shop"));

        applyToEntity(shop, dto);
        shopRepository.save(shop);

        return toDto(shop);
    }

    @Transactional
    public void deleteShop(Long id, Language lang) {
        Shop shop = shopRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Shop"));

        if (lang != Language.SV) {
            translationService.removeTranslationsByLang(shop.getIdentityId(), lang);
            shopRepository.save(shop);
        } else {
            if (translationService.hasNonDefaultLangTranslations(shop.getIdentityId())) {
                throw new UnsupportedArgumentException("Tried to delete shop (lang = default lang) but has other translations");
            }
            shopRepository.delete(shop);
        }
    }

    private void applyToEntity (Shop shop, ShopDto dto) {
        Location location = locationRepository.findById(dto.getLocationId())
                .orElseThrow(() -> new ElementNotFoundException("Location"));

        dto.applyToEntity(shop, location);
    }

    private ShopDto toDto (Shop shop) {
        return new ShopDto(shop);
    }
}
