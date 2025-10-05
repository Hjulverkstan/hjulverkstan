package se.hjulverkstan.main.feature.webedit.localisation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LangCountPerEntityDto {
    Map<Language, Integer> countByLang;
}
