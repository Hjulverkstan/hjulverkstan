package se.hjulverkstan.main.model.webedit;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import se.hjulverkstan.main.dto.webedit.ShopDto;

import java.util.Set;

@Getter
@Setter
@ToString
public class AllWebEditEntitiesDto {

    private Set<GeneralContentStrippedDto> generalContentStripped;
    private Set<ShopDto> shop;
}