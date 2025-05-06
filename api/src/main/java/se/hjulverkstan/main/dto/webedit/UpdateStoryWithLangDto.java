package se.hjulverkstan.main.dto.webedit;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.webedit.Language;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateStoryWithLangDto {
    private Language lang;

    @JsonProperty("story")
    @NotNull(message = "Must include Story")
    private UpdateStoryDto updateStoryDto;
}
