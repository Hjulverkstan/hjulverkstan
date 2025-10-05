package se.hjulverkstan.main.feature.location;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class GetAllLocationDto {
    private List<LocationDto> locations;

    public GetAllLocationDto (List<Location> locations) {
        this.locations = locations.stream().map(LocationDto::new).toList();
    }
}