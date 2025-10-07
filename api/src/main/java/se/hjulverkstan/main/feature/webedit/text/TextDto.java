package se.hjulverkstan.main.feature.webedit.text;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.feature.webedit.localisation.Language;
import se.hjulverkstan.main.feature.webedit.localisation.LocalisedContent;
import se.hjulverkstan.main.feature.webedit.localisation.LocalisedContentUtils;
import se.hjulverkstan.main.shared.AuditableDto;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TextDto extends AuditableDto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private TextType textType;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String name;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String description;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String key;

    private String value;

    public TextDto(Text text, String valueLocalised) {
        super();

        id = text.getId();
        textType = text.getTextType();
        name = text.getName();
        description = text.getDescription();
        key = text.getKey();
        value = valueLocalised;
    }
}

