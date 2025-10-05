package se.hjulverkstan.main.feature.webedit;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.error.exceptions.UnsupportedArgumentException;
import se.hjulverkstan.main.feature.webedit.localisation.LangCountPerEntityDto;
import se.hjulverkstan.main.feature.webedit.localisation.Language;
import se.hjulverkstan.main.feature.webedit.localisation.LocalisedContentRepository;
import se.hjulverkstan.main.feature.webedit.shop.GetAllShopDto;
import se.hjulverkstan.main.feature.webedit.shop.ShopService;
import se.hjulverkstan.main.feature.webedit.story.GetAllStoryDto;
import se.hjulverkstan.main.feature.webedit.story.StoryService;
import se.hjulverkstan.main.feature.webedit.text.GetAllTextDto;
import se.hjulverkstan.main.feature.webedit.text.TextService;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class WebEditService {

    private final LocalisedContentRepository localisedContentRepository;
    private final TextService textService;
    private final ShopService shopService;
    private final StoryService storyService;

    public LangCountPerEntityDto getLangCountByEntity(WebEditEntity entity) {
        Map<Language, Integer> langCounts = new EnumMap<>(Language.class);

        for (Language lang : Language.values()) {
            langCounts.put(lang, 0);
        }

        List<Object[]> results = switch (entity) {
            case WebEditEntity.TEXT -> localisedContentRepository.countLangBytext()
                    .orElseThrow(() -> new ElementNotFoundException(WebEditEntity.TEXT.name()));
            case WebEditEntity.SHOP -> localisedContentRepository.countLangByShop()
                    .orElseThrow(() -> new ElementNotFoundException(WebEditEntity.SHOP.name()));
            case WebEditEntity.STORY -> localisedContentRepository.countLangByStory()
                    .orElseThrow(() -> new ElementNotFoundException(WebEditEntity.STORY.name()));
        };

        results.forEach(result -> {
            Language lang = (Language) result[0];
            Integer count = ((Number) result[1]).intValue();
            langCounts.put(lang, count);
        });

        return new LangCountPerEntityDto(langCounts);
    }

    public AllWebEditEntitiesByLangDto getAllLocalisedEntitiesWithFallback(Language fallbackLang) {
        Set<Language> langs = localisedContentRepository.findDistinctLangs()
                .orElseThrow(() -> new ElementNotFoundException("Languages"));

        AllWebEditEntitiesByLangDto entitiesByLangDto = new AllWebEditEntitiesByLangDto();

        for (Language lang : langs) {
            AllWebEditEntitiesDto entitiesDto = new AllWebEditEntitiesDto();
            GetAllShopDto allShopDto = shopService.getAllShopsByLang(lang, fallbackLang);
            GetAllStoryDto allStoryDto = storyService.getAllStoriesByLang(lang, fallbackLang);
            GetAllTextDto allTextDto = textService.getAllTextsByLang(lang, fallbackLang);

            entitiesDto.setShops(allShopDto.getShops());
            entitiesDto.setStories(allStoryDto.getStories());
            entitiesDto.setText(allTextDto.getAsKeyValueMap());

            entitiesByLangDto.getEntities().put(lang, entitiesDto);
        }

        return entitiesByLangDto;
    }
}
