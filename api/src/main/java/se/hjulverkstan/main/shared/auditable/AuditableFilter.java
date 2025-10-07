package se.hjulverkstan.main.shared.auditable;

import org.springframework.data.jpa.domain.Specification;
import se.hjulverkstan.main.shared.specs.Specs;

public class AuditableFilter {
    public static <T extends Auditable> Specification<T> create(AuditableFilterDto dto) {
        if (dto == null) return null;

        return Specs.allOf(
                AuditableSpecs.createdAt(dto.getCreatedAt()),
                AuditableSpecs.updatedAt(dto.getUpdatedAt()),
                AuditableSpecs.createdBy(dto.getCreatedBy()),
                AuditableSpecs.updatedBy(dto.getUpdatedBy())
        );
    }
}