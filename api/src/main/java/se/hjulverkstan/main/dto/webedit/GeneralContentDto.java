package se.hjulverkstan.main.dto.webedit;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.webedit.TextType;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GeneralContentDto {
    private Long id;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private TextType textType;
    private String name;
    private String description;
    private String key;
    private String value;
}

