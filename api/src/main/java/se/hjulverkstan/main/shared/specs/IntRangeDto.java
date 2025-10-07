package se.hjulverkstan.main.shared.specs;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class IntRangeDto {
    Integer min;
    Integer max;
}
