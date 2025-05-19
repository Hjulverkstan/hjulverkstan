package se.hjulverkstan.main.dto.webedit;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.webedit.Language;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewStoryWithLangDto {
    @NotNull(message = "Language is required")
   private Language lang;

    @JsonProperty("story")
    @Valid
    @NotNull(message = "'Story' is required")
   private NewStoryDto newStoryDto;
}
