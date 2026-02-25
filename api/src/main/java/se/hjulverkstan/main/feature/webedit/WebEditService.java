package se.hjulverkstan.main.feature.webedit;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.feature.webedit.shop.ShopDto;
import se.hjulverkstan.main.feature.webedit.shop.ShopService;
import se.hjulverkstan.main.feature.webedit.story.StoryDto;
import se.hjulverkstan.main.feature.webedit.story.StoryService;
import se.hjulverkstan.main.feature.webedit.text.TextDto;
import se.hjulverkstan.main.feature.webedit.text.TextKey;
import se.hjulverkstan.main.feature.webedit.text.TextService;
import se.hjulverkstan.main.feature.webedit.translation.Language;
import se.hjulverkstan.main.feature.webedit.translation.TranslationSetRepository;
import se.hjulverkstan.main.shared.ListResponseDto;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class WebEditService {

    private final TranslationSetRepository translationSetRepository;
    private final TextService textService;
    private final ShopService shopService;
    private final StoryService storyService;

    public LangCountPerEntityDto getLangCountByEntity(WebEditEntity entity) {
        Map<Language, Integer> langCounts = new EnumMap<>(Language.class);

        for (Language lang : Language.values()) {
            langCounts.put(lang, 0);
        }

        List<Object[]> results = switch (entity) {
            case WebEditEntity.TEXT -> translationSetRepository.countLangByEntity(WebEditEntity.TEXT)
                    .orElseThrow(() -> new ElementNotFoundException(WebEditEntity.TEXT.name()));
            case WebEditEntity.SHOP -> translationSetRepository.countLangByEntity(WebEditEntity.SHOP)
                    .orElseThrow(() -> new ElementNotFoundException(WebEditEntity.SHOP.name()));
            case WebEditEntity.STORY -> translationSetRepository.countLangByEntity(WebEditEntity.STORY)
                    .orElseThrow(() -> new ElementNotFoundException(WebEditEntity.STORY.name()));
        };

        results.forEach(result -> {
            Language lang = (Language) result[0];
            Integer count = ((Number) result[1]).intValue();
            langCounts.put(lang, count);
        });

        return new LangCountPerEntityDto(langCounts);
    }

    public AllWebEditEntitiesByLangDto getAllTranslatedEntities() {
        Set<Language> langs = translationSetRepository.findDistinctLangs()
                .orElseThrow(() -> new ElementNotFoundException("Languages"));

        AllWebEditEntitiesByLangDto entitiesByLangDto = new AllWebEditEntitiesByLangDto();

        for (Language lang : langs) {
            AllWebEditEntitiesDto entitiesDto = new AllWebEditEntitiesDto();
            ListResponseDto<ShopDto> shopsDto = shopService.getAllShopsByLang(lang);
            ListResponseDto<StoryDto> storiesDto = storyService.getAllStoriesByLang(lang);
            ListResponseDto<TextDto> textsDto = textService.getAllTextsByLang(lang);

            Map<TextKey, String> textMap = textsDto.getContent().stream()
                    .collect(Collectors.toMap(
                            TextDto::getKey,
                            dto -> Optional.ofNullable(dto.getValue()).orElse("")
                    ));

            entitiesDto.setShops(shopsDto.getContent());
            entitiesDto.setStories(storiesDto.getContent());
            entitiesDto.setText(textMap);

            entitiesByLangDto.getEntities().put(lang, entitiesDto);
        }

        return entitiesByLangDto;
    }
}
