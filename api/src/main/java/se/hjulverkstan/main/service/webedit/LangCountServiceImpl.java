package se.hjulverkstan.main.service.webedit;

import org.springframework.stereotype.Service;
import se.hjulverkstan.Exceptions.ElementNotFoundException;
import se.hjulverkstan.Exceptions.UnsupportedArgumentException;
import se.hjulverkstan.main.dto.webedit.LangCountPerEntityDto;
import se.hjulverkstan.main.model.webedit.Language;
import se.hjulverkstan.main.repository.webedit.LocalisedContentRepository;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
public class LangCountServiceImpl implements LangCountService {
    private final LocalisedContentRepository localisedContentRepository;

    public LangCountServiceImpl(LocalisedContentRepository localisedContentRepository) {
        this.localisedContentRepository = localisedContentRepository;
    }

    @Override
    public LangCountPerEntityDto getLangCountByEntity(String entity) {
        Map<Language, Integer> langCounts = new EnumMap<>(Language.class);

        for (Language lang : Language.values()) {
            langCounts.put(lang, 0);
        }

        List<Object[]> results = switch (entity.toLowerCase()) {
            case "generalcontent" -> localisedContentRepository.countLangByGeneralContent()
                    .orElseThrow(() -> new ElementNotFoundException("General Content"));
            case "shop" -> localisedContentRepository.countLangByShop()
                    .orElseThrow(() -> new ElementNotFoundException("Shop"));
            case "story" -> localisedContentRepository.countLangByStory()
                    .orElseThrow(() -> new ElementNotFoundException("Story"));
            default -> throw new UnsupportedArgumentException(entity.toLowerCase());
        };


        results.forEach(result -> {
            Language lang = (Language) result[0];
            Integer count = ((Number) result[1]).intValue();
            langCounts.put(lang, count);
        });

        return new LangCountPerEntityDto(langCounts);
    }

}
