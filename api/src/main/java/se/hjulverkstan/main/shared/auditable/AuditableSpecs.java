package se.hjulverkstan.main.shared.auditable;

import org.springframework.data.jpa.domain.Specification;
import se.hjulverkstan.main.shared.specs.DateRangeDto;
import se.hjulverkstan.main.shared.specs.Specs;

import java.util.List;

public class AuditableSpecs {

    public static <T extends Auditable> Specification<T> createdBy(List<String> values) {
        if (values == null || values.isEmpty()) return null;
        return (root, query, cb) -> root.get(Auditable_.createdBy).in(values);
    }

    public static <T extends Auditable> Specification<T> updatedBy(List<String> values) {
        if (values == null || values.isEmpty()) return null;
        return (root, query, cb) -> root.get(Auditable_.updatedBy).in(values);
    }

    public static <T extends Auditable> Specification<T> createdAt(DateRangeDto range) {
        return Specs.dateRange(range, root -> root.get(Auditable_.createdAt));
    }

    public static <T extends Auditable> Specification<T> updatedAt(DateRangeDto range) {
        return Specs.dateRange(range, root -> root.get(Auditable_.updatedAt));
    }
}