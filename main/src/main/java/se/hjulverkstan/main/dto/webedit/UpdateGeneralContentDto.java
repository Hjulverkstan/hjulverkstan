package se.hjulverkstan.main.dto.webedit;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.webedit.TextType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateGeneralContentDto {
    private String value;

    public String getName() {
        return null;
    }

    public String getDescription() {
        return null;
    }

    public TextType getTextType() {
        return null;
    }

    public String getKey() {
        return null;
    }
}
