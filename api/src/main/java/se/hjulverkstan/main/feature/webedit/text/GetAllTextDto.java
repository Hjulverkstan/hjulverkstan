package se.hjulverkstan.main.feature.webedit.text;

import lombok.Getter;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.feature.webedit.localisation.Language;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
public class GetAllTextDto {
    private List<TextDto> texts;
    
    public GetAllTextDto(List<Text> texts, Language lang, Language fallbackLang) {
        this.texts = texts.stream().map(text -> new TextDto(text, lang, fallbackLang)).toList();
    }

    public Map<String, String> getAsKeyValueMap () {
        return texts.stream().collect(Collectors.toMap(TextDto::getKey, TextDto::getValue));
    }
}
