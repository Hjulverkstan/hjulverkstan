package se.hjulverkstan.main.shared;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditableFilterDto {
    private DateRangeDto createdAt;
    private DateRangeDto updatedAt;
    private List<String> createdBy;
    private List<String> updatedBy;
}