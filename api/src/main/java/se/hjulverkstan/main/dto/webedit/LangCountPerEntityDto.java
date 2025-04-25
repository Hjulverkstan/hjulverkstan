package se.hjulverkstan.main.dto.webedit;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.webedit.Language;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LangCountPerEntityDto {
    Map<Language, Integer> countByLang;

    @JsonAnyGetter
    public Map<Language, Integer> getCountByLang() {
        return countByLang;
    }
}
