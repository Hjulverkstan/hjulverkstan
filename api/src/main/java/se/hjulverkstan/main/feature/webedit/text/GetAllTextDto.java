package se.hjulverkstan.main.feature.webedit.text;

import lombok.Getter;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.feature.webedit.localisation.Language;

import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
public class GetAllTextDto {
    private List<TextDto> texts;
    
    public GetAllTextDto(List<Text> texts, Function<Text, TextDto> mapper) {
        this.texts = texts.stream().map(mapper).toList();
    }

    public Map<String, String> getAsKeyValueMap () {
        return texts.stream().collect(Collectors.toMap(TextDto::getKey, TextDto::getValue));
    }
}
