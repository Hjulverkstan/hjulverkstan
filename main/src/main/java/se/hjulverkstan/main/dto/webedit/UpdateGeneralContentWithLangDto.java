package se.hjulverkstan.main.dto.webedit;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.webedit.Language;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateGeneralContentWithLangDto {
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Language lang;
    private UpdateGeneralContentDto updateGeneralContentDto;
}
