package se.hjulverkstan.main.feature.webedit.shop;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.feature.location.Location;
import se.hjulverkstan.main.feature.location.LocationRepository;
import se.hjulverkstan.main.shared.ListResponseDto;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ShopService {

    private final ShopRepository shopRepository;
    private final LocationRepository locationRepository;

    public ListResponseDto<ShopDto> getAllShops() {
        List<Shop> shops = shopRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));

        return new ListResponseDto<>(shops.stream().map(shop -> toDto(shop)).toList());
    }

    public ShopDto getShopById(Long id) {
        Shop shop = shopRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Shop"));
        return toDto(shop);
    }

    @Transactional
    public ShopDto createShop(ShopDto dto) {
        Shop shop = new Shop();

        applyToEntity(shop, dto);
        shopRepository.save(shop);

        return toDto(shop);
    }

    @Transactional
    public ShopDto editShop(Long id, ShopDto dto) {
        Shop shop = shopRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Shop"));

        applyToEntity(shop, dto);
        shopRepository.save(shop);

        return toDto(shop);
    }

    @Transactional
    public void deleteShop(Long id) {
        Shop shop = shopRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Shop"));
        shopRepository.delete(shop);
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
