package se.hjulverkstan.main.service.webedit;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.common.exception.ElementNotFoundException;
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
public class LocalisationServiceImpl implements LocalisationService {

    private final GeneralContentService generalContentService;
    private final LocalisedContentRepository localisedContentRepository;
    private final ShopService shopService;

    public LocalisationServiceImpl(GeneralContentService generalContentService, LocalisedContentRepository localisedContentRepository, ShopService shopService) {
        this.generalContentService = generalContentService;
        this.localisedContentRepository = localisedContentRepository;
        this.shopService = shopService;
    }


    @Override
    public AllWebEditEntitiesByLangDto getAllLocalisedEntitiesWithFallback(Language fallbackLang) {
        Set<Language> langs = localisedContentRepository.findDistinctLangs()
                .orElseThrow(() -> new ElementNotFoundException("Languages"));

        AllWebEditEntitiesByLangDto allDto = new AllWebEditEntitiesByLangDto();
        allDto.setEntities(new HashMap<>());

        for (Language lang : langs) {
            AllWebEditEntitiesDto allEntitiesDto = new AllWebEditEntitiesDto();

            Set<GeneralContentStrippedDto> strippedGeneralContent = mapToGeneralContentDto(lang, fallbackLang, generalContentService);
            allEntitiesDto.setGeneralContent(strippedGeneralContent);

            Set<ShopDto> strippedShops = mapToAllShopsWithFallbackLangDto(lang, fallbackLang, shopService);
            allEntitiesDto.setShop(strippedShops);


            allDto.getEntities().put(lang, allEntitiesDto);
        }


        return allDto;
    }

    private static Set<ShopDto> mapToAllShopsWithFallbackLangDto(Language lang, Language fallbackLang, ShopService shopService) {

        List<ShopDto> shopDtos = shopService.getAllShopsByLang(lang);
        return shopDtos.stream().peek(shop -> {
            if (shop.getBodyText() == null) {
                String fallbackBodyText = shopService.getShopByIdAndLang(shop.getId(), fallbackLang).getBodyText();
                shop.setBodyText(fallbackBodyText);
            }
        }).collect(Collectors.toSet());
    }

    private static Set<GeneralContentStrippedDto> mapToGeneralContentDto(Language lang, Language fallbackLang, GeneralContentService generalContentService) {
        List<GeneralContentDto> generalContentByLang = fetchGeneralContentByLang(lang, generalContentService);
        return generalContentByLang.stream()
                .map(gc -> mapToStrippedDto(gc, fallbackLang, generalContentService))
                .collect(Collectors.toSet());
    }

    private static List<GeneralContentDto> fetchGeneralContentByLang(Language lang, GeneralContentService generalContentService) {
        return generalContentService.getAllGeneralContentsByLang(lang);
    }

    private static GeneralContentStrippedDto mapToStrippedDto(GeneralContentDto gc, Language fallbackLang, GeneralContentService generalContentService) {
        GeneralContentStrippedDto stripped = new GeneralContentStrippedDto();
        stripped.setKey(gc.getKey());

        if (gc.getValue() != null) {
            stripped.setValue(gc.getValue());
        } else {
            String fallback = generalContentService.getGeneralContentByIdAndLang(gc.getId(), fallbackLang).getValue();
            stripped.setValue(fallback);
        }

        return stripped;
    }
}
