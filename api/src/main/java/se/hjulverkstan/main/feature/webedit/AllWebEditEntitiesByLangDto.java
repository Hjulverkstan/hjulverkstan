package se.hjulverkstan.main.feature.webedit;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.feature.webedit.localisation.Language;

import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AllWebEditEntitiesByLangDto {
    private Map<Language, AllWebEditEntitiesDto> entities = new HashMap<>();
}