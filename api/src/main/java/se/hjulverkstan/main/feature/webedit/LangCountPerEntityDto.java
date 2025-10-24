package se.hjulverkstan.main.feature.webedit;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.feature.webedit.localisation.Language;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LangCountPerEntityDto {
    Map<Language, Integer> countByLang;
}
