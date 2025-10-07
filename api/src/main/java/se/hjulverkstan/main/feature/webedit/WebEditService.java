package se.hjulverkstan.main.feature.webedit;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.feature.webedit.localisation.LangCountPerEntityDto;
import se.hjulverkstan.main.feature.webedit.localisation.Language;
import se.hjulverkstan.main.feature.webedit.localisation.LocalisedContentRepository;
import se.hjulverkstan.main.feature.webedit.shop.ShopDto;
import se.hjulverkstan.main.feature.webedit.shop.ShopService;
import se.hjulverkstan.main.feature.webedit.story.StoryDto;
import se.hjulverkstan.main.feature.webedit.story.StoryService;
import se.hjulverkstan.main.feature.webedit.text.TextDto;
import se.hjulverkstan.main.feature.webedit.text.TextService;
import se.hjulverkstan.main.shared.ListResponseDto;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

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
            ListResponseDto<ShopDto> shopsDto = shopService.getAllShopsByLang(lang, fallbackLang);
            ListResponseDto<StoryDto> storiesDto = storyService.getAllStoriesByLang(lang, fallbackLang);
            ListResponseDto<TextDto> textsDto = textService.getAllTextsByLang(lang, fallbackLang);

            Map<String, String> textMap = textsDto.getContent().stream()
                    .collect(Collectors.toMap(TextDto::getKey, TextDto::getValue));

            entitiesDto.setShops(shopsDto.getContent());
            entitiesDto.setStories(storiesDto.getContent());
            entitiesDto.setText(textMap);

            entitiesByLangDto.getEntities().put(lang, entitiesDto);
        }

        return entitiesByLangDto;
    }
}
