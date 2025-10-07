package se.hjulverkstan.main.shared.specs;

import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

public class Specs {

    public static <V, T> Specification<V> eq(T value, Function<Root<V>, Path<T>> pathFn) {
        if (value == null) return null;
        return (root, query, cb) -> cb.equal(pathFn.apply(root), value);
    }

    public static <V, T extends Enum<T>> Specification<V> enumIn(List<T> values, Function<Root<V>, Path<T>> pathFn) {
        if (values == null || values.isEmpty()) return null;
        return (root, query, cb) -> pathFn.apply(root).in(values);
    }

    public static <V, T> Specification<V> in(List<T> values, Function<Root<V>, Path<T>> pathFn) {
        if (values == null || values.isEmpty()) return null;
        return (root, query, cb) -> pathFn.apply(root).in(values);
    }

    public static <V, T> Specification<V> inManyToMany(List<T> values, Function<Root<V>, Path<T>> pathFn) {
        if (values == null || values.isEmpty()) return null;
        return (root, query, cb) -> pathFn.apply(root).in(values);
    }

    public static <V> Specification<V> intRange(IntRangeDto range, Function<Root<V>, Path<Integer>> pathFn) {
        if (range == null) return null;

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (range.getMin() != null) predicates.add(cb.ge(pathFn.apply(root), range.getMin()));
            if (range.getMax() != null) predicates.add(cb.le(pathFn.apply(root), range.getMax()));
            if (predicates.isEmpty()) return cb.conjunction();
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static <V> Specification<V> containsAny(List<String> values, Function<Root<V>, Path<String>> pathFn) {
        if (values == null || values.isEmpty()) return null;
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            for (String val : values) {
                predicates.add(cb.like(cb.lower(pathFn.apply(root)), "%" + val.toLowerCase() + "%"));
            }
            return cb.or(predicates.toArray(new Predicate[0]));
        };
    }

    public static <T> Specification<T> dateRange(DateRangeDto range, Function<Root<T>, Path<LocalDateTime>> mapper) {
        if (range == null) return null;
        return (root, query, cb) -> {
            Path<LocalDateTime> path = mapper.apply(root);
            List<Predicate> predicates = new ArrayList<>();
            if (range.getFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(path, range.getFrom()));
            }
            if (range.getTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(path, range.getTo()));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    @SafeVarargs
    public static <T> Specification<T> allOf(Specification<T>... specs) {
        Specification<T> result = Specification.where(null);
        for (Specification<T> s : specs) {
            if (s != null) result = result.and(s);
        }
        return result;
    }
}