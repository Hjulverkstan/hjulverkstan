package se.hjulverkstan.main.shared.auditable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.shared.FilterUtils;
import se.hjulverkstan.main.shared.ValueCountDto;
import se.hjulverkstan.main.shared.specs.DateRangeDto;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditableFilterCountsDto {
    private DateRangeDto createdAt;
    private DateRangeDto updatedAt;

    private List<ValueCountDto<String>> createdBy;
    private List<ValueCountDto<String>> updatedBy;

    public AuditableFilterCountsDto(List<? extends AuditableDto> entities) {
        createdAt = FilterUtils.dateRange(entities, AuditableDto::getCreatedAt);
        updatedAt = FilterUtils.dateRange(entities, AuditableDto::getUpdatedAt);
        createdBy = FilterUtils.countsList(entities, AuditableDto::getCreatedBy);
        updatedBy = FilterUtils.countsList(entities, AuditableDto::getUpdatedBy);
    }
}