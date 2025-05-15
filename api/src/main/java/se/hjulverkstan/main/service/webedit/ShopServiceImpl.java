package se.hjulverkstan.main.service.webedit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.Exceptions.DataViolationException;
import se.hjulverkstan.Exceptions.ElementNotFoundException;
import se.hjulverkstan.main.dto.webedit.*;
import se.hjulverkstan.main.model.Location;
import se.hjulverkstan.main.model.webedit.*;
import se.hjulverkstan.main.repository.LocationRepository;
import se.hjulverkstan.main.repository.webedit.LocalisedContentRepository;
import se.hjulverkstan.main.repository.webedit.ShopRepository;

import java.util.List;

@Service
@Transactional
public class ShopServiceImpl implements ShopService {
    private final ShopRepository shopRepository;
    private final LocationRepository locationRepository;


    @Autowired
    public ShopServiceImpl(ShopRepository shopRepository, LocationRepository locationRepository) {
        this.shopRepository = shopRepository;
        this.locationRepository = locationRepository;
    }

    @Override
    public List<ShopDto> getAllShopsByLang(Language lang) {
        List<Shop> shopList = shopRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));

        return shopList.stream()
                .map(shop -> mapShopToDto(shop, lang))
                .toList();
    }

    @Override
    public ShopDto getShopByIdAndLang(Long id, Language lang) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException("Shop with id " + id));

        return mapShopToDto(shop, lang);
    }

    @Override
    public ShopDto deleteShop(Long id) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException("Shop with id " + id));

        ShopDto shopDto = mapShopToDto(shop, Language.ENG);
        shopRepository.delete(shop);
        return shopDto;
    }


    @Override
    public ShopDto createShop(NewShopWithLangDto newShopWithLangDto) {
        NewShopDto shopDto = newShopWithLangDto.getNewShopDto();
        Shop shop = new Shop();

        shop.setName(shopDto.getName());
        shop.setAddress(shopDto.getAddress());
        shop.setLatitude(shopDto.getLatitude());
        shop.setLongitude(shopDto.getLongitude());
        shop.setImageURL(shopDto.getImageURL());
        shop.setSlug(shopDto.getSlug());
        shop.setOpenHours(mapOpenHoursDtoToEntity(null, shopDto.getOpenHours()));
        shop.setHasTemporaryHours(shopDto.getHasTemporaryHours() != null && shopDto.getHasTemporaryHours());

        Location location = locationRepository.findById(shopDto.getLocationId())
                .orElseThrow(() -> new ElementNotFoundException("Location with id " + shopDto.getLocationId()));
        shop.setLocation(location);

        LocalisedContent lc = new LocalisedContent();
        lc.setLang(newShopWithLangDto.getLang());
        lc.setFieldName(FieldNameType.BODY_TEXT);
        lc.setContent(shopDto.getBodyText());
        lc.setShop(shop);
        shop.setLocalisedContent(List.of(lc));

        try {
            shopRepository.save(shop);
        } catch (DataIntegrityViolationException ex) {
            throw new DataViolationException("A location cannot be connected to multiple shops and vice versa");
        }
        return mapShopToDto(shop, newShopWithLangDto.getLang());
    }

    @Override
    public ShopDto editShop(Long id, UpdateShopWithLangDto request) {
        Shop selectedShop = shopRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException("Shop with id " + id));
        UpdateShopDto shopDto = request.getUpdateShopDto();
        Language lang = request.getLang();

        selectedShop.setName(shopDto.getName());
        selectedShop.setAddress(shopDto.getAddress());
        selectedShop.setLatitude(shopDto.getLatitude());
        selectedShop.setLongitude(shopDto.getLongitude());
        selectedShop.setImageURL(shopDto.getImageURL());
        selectedShop.setOpenHours(mapOpenHoursDtoToEntity(selectedShop.getOpenHours(), shopDto.getOpenHours()));
        selectedShop.setHasTemporaryHours(shopDto.getHasTemporaryHours());

        try {
            Location location = locationRepository.findById(shopDto.getLocationId())
                    .orElseThrow(() -> new ElementNotFoundException("Location with id " + shopDto.getLocationId()));
            selectedShop.setLocation(location);

            String newValue = shopDto.getBodyText();
            LocalisedContent localisedContent = selectedShop.getLocalisedContent().stream()
                    .filter(lc -> lc.getLang() != null && lc.getLang().equals(lang))
                    .findFirst()
                    .orElse(null);

            // If new value is null delete the LocalisedContent if it exists
            if (newValue == null) {
                if (localisedContent != null) {
                    selectedShop.getLocalisedContent().remove(localisedContent);
                    shopRepository.save(selectedShop);
                    return mapShopToDto(selectedShop, lang);
                }

                return mapShopToDto(selectedShop, lang);
            }

            if (localisedContent != null) {
                // if value is changed, set new value otherwise return original
                if (!newValue.equals(localisedContent.getContent())) {
                    localisedContent.setContent(newValue);
                    shopRepository.save(selectedShop);
                }
            } else {
                //Create new LocalisedContent with value since no value exists for selected lang
                LocalisedContent lc = new LocalisedContent();
                lc.setLang(lang);
                lc.setFieldName(FieldNameType.BODY_TEXT);
                lc.setContent(newValue);
                lc.setShop(selectedShop);

                selectedShop.getLocalisedContent().add(lc);

                shopRepository.save(selectedShop);
            }
        } catch (DataIntegrityViolationException ex) {
            throw new DataViolationException("A location cannot be connected to multiple shops and vice versa");
        }

        return mapShopToDto(selectedShop, lang);
    }

    /**
     * Maps a Shop entity to a ShopDto, including localized content for the specified language.
     * Localized content is included if available; otherwise, the value is set to null.
     *
     * @param shop The GeneralContent entity to convert.
     * @param lang           The ISO 639-2 language code for filtering the localized content.
     * @return A populated ShopDto with attributes and localized content based on availability.
     */
    private ShopDto mapShopToDto(Shop shop, Language lang) {
        ShopDto shopDto = new ShopDto();
        shopDto.setId(shop.getId());
        shopDto.setName(shop.getName());
        shopDto.setAddress(shop.getAddress());
        shopDto.setLatitude(shop.getLatitude());
        shopDto.setLongitude(shop.getLongitude());
        shopDto.setImageURL(shop.getImageURL());
        shopDto.setSlug(shop.getSlug());

        OpenHoursDto openHoursDto = mapOpenHoursToDto(shop.getOpenHours());
        shopDto.setOpenHours(openHoursDto);

        shopDto.setHasTemporaryHours(shop.getHasTemporaryHours());
        shopDto.setLocationId(shop.getLocation().getId());

        // Shops only have one possible localisedContent, which is bodyText.
        String bodyText = shop.getLocalisedContent().stream()
                .filter(lc -> lc.getLang() != null && lc.getLang().equals(lang))
                .findFirst()
                .map(LocalisedContent::getContent)
                .orElse(null);
        shopDto.setBodyText(bodyText);

        return shopDto;
    }


    private OpenHoursDto mapOpenHoursToDto(OpenHours openHours) {
        OpenHoursDto dto = new OpenHoursDto();
        dto.setMon(openHours.getMon());
        dto.setTue(openHours.getTue());
        dto.setWed(openHours.getWed());
        dto.setThu(openHours.getThu());
        dto.setFri(openHours.getFri());
        dto.setSat(openHours.getSat());
        dto.setSun(openHours.getSun());
        return dto;
    }

    /**
     * Maps an OpenHoursDto to an OpenHours entity
     * @param openHours OpenHoursDto to map. If value is null method creates new OpenHours object.
     * @return A populated OpenHours entity
     */
    private OpenHours mapOpenHoursDtoToEntity(OpenHours openHours, OpenHoursDto dto) {
        if (openHours == null) {
            openHours = new OpenHours();
        }
        openHours.setMon(dto.getMon());
        openHours.setTue(dto.getTue());
        openHours.setWed(dto.getWed());
        openHours.setThu(dto.getThu());
        openHours.setFri(dto.getFri());
        openHours.setSat(dto.getSat());
        openHours.setSun(dto.getSun());
        return openHours;
    }
}
