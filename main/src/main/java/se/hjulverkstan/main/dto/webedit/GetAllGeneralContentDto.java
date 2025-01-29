package se.hjulverkstan.main.dto.webedit;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAllGeneralContentDto {
    private List<GeneralContentDto> generalContentEntries;
}