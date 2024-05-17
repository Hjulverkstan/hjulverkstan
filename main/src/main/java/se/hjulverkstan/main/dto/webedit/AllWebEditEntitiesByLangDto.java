package se.hjulverkstan.main.dto.webedit;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.webedit.AllWebEditEntitiesDto;
import se.hjulverkstan.main.model.webedit.Language;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AllWebEditEntitiesByLangDto {
    private Map<Language, AllWebEditEntitiesDto> entities;
}