package se.hjulverkstan.main.service.webedit;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.Exceptions.ElementNotFoundException;
import se.hjulverkstan.main.dto.webedit.AllWebEditEntitiesByLangDto;
import se.hjulverkstan.main.dto.webedit.GeneralContentDto;
import se.hjulverkstan.main.dto.webedit.ShopDto;
import se.hjulverkstan.main.model.webedit.AllWebEditEntitiesDto;
import se.hjulverkstan.main.model.webedit.GeneralContentStrippedDto;
import se.hjulverkstan.main.model.webedit.Language;
import se.hjulverkstan.main.repository.webedit.LocalisedContentRepository;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class LocalizedContentAndShopServiceImpl implements LocalizedContentAndShopService {

    private final GeneralContentService generalContentService;
    private final LocalisedContentRepository localisedContentRepository;
    private final ShopService shopService;

    public LocalizedContentAndShopServiceImpl(GeneralContentService generalContentService, LocalisedContentRepository localisedContentRepository, ShopService shopService) {
        this.generalContentService = generalContentService;
        this.localisedContentRepository = localisedContentRepository;
        this.shopService = shopService;
    }


    @Override
    public AllWebEditEntitiesByLangDto getAllLocalisedData(Language fallbackLang) {
        Set<Language> langs = localisedContentRepository.findDistinctLangs()
                .orElseThrow(() -> new ElementNotFoundException("Languages"));

        AllWebEditEntitiesByLangDto allDto = new AllWebEditEntitiesByLangDto();
        allDto.setEntities(new HashMap<>());

        for (Language lang : langs) {
            AllWebEditEntitiesDto allEntitiesDto = new AllWebEditEntitiesDto();

            Set<GeneralContentStrippedDto> strippedGeneralContent = mapToGeneralContentStrippedDto(lang, fallbackLang, generalContentService);
            allEntitiesDto.setGeneralContentStripped(strippedGeneralContent);

            Set<ShopDto> strippedShops = mapToShopStrippedDto(lang, fallbackLang, shopService);
            allEntitiesDto.setShop(strippedShops);


            allDto.getEntities().put(lang, allEntitiesDto);
        }


        return allDto;
    }

    private static Set<ShopDto> mapToShopStrippedDto(Language lang, Language fallbackLang, ShopService shopService) {

        List<ShopDto> shopDtos = shopService.getAllShopsByLang(lang);
        return shopDtos.stream().peek(shop -> {
            if (shop.getBodyText() == null) {
                String fallbackBodyText = shopService.getShopByIdAndLang(shop.getId(), fallbackLang).getBodyText();
                shop.setBodyText(fallbackBodyText);
            }
        }).collect(Collectors.toSet());
    }

    private static Set<GeneralContentStrippedDto> mapToGeneralContentStrippedDto(Language lang, Language fallbackLang, GeneralContentService generalContentService) {
        List<GeneralContentDto> generalContentByLang = generalContentService.getAllGeneralContentsByLang(lang);
        return generalContentByLang.stream()
                .map(gc -> {
                    GeneralContentStrippedDto stripped = new GeneralContentStrippedDto();
                    stripped.setKey(gc.getKey());
                    if (gc.getValue() != null) {
                        stripped.setValue(gc.getValue());
                    } else {
                        String fallback = generalContentService.getGeneralContentByIdAndLang(gc.getId(), fallbackLang).getValue();
                        stripped.setValue(fallback);
                    }
                    return stripped;
                }).collect(Collectors.toSet());
    }
}