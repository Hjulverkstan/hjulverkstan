package se.hjulverkstan.main.feature.webedit;

import lombok.Data;
import se.hjulverkstan.main.feature.webedit.shop.ShopDto;
import se.hjulverkstan.main.feature.webedit.story.StoryDto;
import se.hjulverkstan.main.feature.webedit.text.TextKey;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
public class AllWebEditEntitiesDto {
    private Map<TextKey, String> text = new HashMap<>();
    private List<ShopDto> shops;
    private List<StoryDto> stories;
}
