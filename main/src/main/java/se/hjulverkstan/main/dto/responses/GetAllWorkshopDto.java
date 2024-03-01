package se.hjulverkstan.main.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.dto.WorkshopDto;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAllWorkshopDto {
    private List<WorkshopDto> workshops;
}
