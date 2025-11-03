package se.hjulverkstan.main.feature.webedit.text;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.shared.auditable.AuditableDto;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TextDto extends AuditableDto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private TextKey key;

    private String value;

    public TextDto(Text text, String valueLocalised) {
        super();

        id = text.getId();
        key = text.getKey();
        value = valueLocalised;
    }

    // No applyToEntity method as the only updatable field is localized contents, completely managed by the service.
}

