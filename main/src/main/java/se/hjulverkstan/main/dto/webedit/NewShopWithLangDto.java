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
public class NewShopWithLangDto {
    @NotNull(message = "Language is required")
    Language lang;

    @JsonProperty("shop")
    @Valid
    @NotNull(message = "'shop' is required")
    NewShopDto newShopDto;
}
