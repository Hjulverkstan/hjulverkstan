package se.hjulverkstan.main.shared;

import se.hjulverkstan.main.shared.specs.DateRangeDto;
import se.hjulverkstan.main.shared.specs.IntRangeDto;

import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

public final class FilterUtils {
    private FilterUtils() {}

    public static <T, R> List<R> distinctList(Collection<T> entities, Function<T, R> extractor) {
        if (entities == null || extractor == null) return Collections.emptyList();
        return entities.stream()
                .filter(Objects::nonNull)
                .map(extractor)
                .filter(Objects::nonNull)
                .distinct()
                .toList();
    }

    public static <T, R> List<R> distinctFlattenedList(Collection<T> entities, Function<T, Collection<R>> extractor) {
        if (entities == null || extractor == null) return Collections.emptyList();

        return entities.stream()
                .filter(Objects::nonNull)
                .map(extractor)
                .filter(Objects::nonNull)
                .flatMap(Collection::stream)
                .filter(Objects::nonNull)
                .distinct()
                .toList();
    }

    public static <T, R> Map<R, Long> counts(Collection<T> entities, Function<T, R> extractor) {
        if (entities == null || extractor == null) return Collections.emptyMap();

        return entities.stream()
                .filter(Objects::nonNull)
                .map(extractor)                 // R (may be null)
                .filter(Objects::nonNull)       // skip null values
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
    }

    public static <T, R> List<ValueCountDto<R>> countsList(Collection<T> entities, Function<T, R> extractor) {
        Map<R, Long> map = counts(entities, extractor);
        return map.entrySet().stream()
                .map(e -> new ValueCountDto<>(e.getKey(), e.getValue()))
                .sorted(Comparator.comparingLong(ValueCountDto<R>::getCount).reversed())
                .toList();
    }

    public static <T, R> Map<R, Long> flattenedCounts(Collection<T> entities, Function<T, Collection<R>> extractor) {
        if (entities == null || extractor == null) return Collections.emptyMap();

        return entities.stream()
                .filter(Objects::nonNull)
                .map(extractor)                    // Collection<R> (may be null)
                .filter(Objects::nonNull)
                .flatMap(Collection::stream)       // R
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
    }

    public static <T, R> List<ValueCountDto<R>> flattenedCountsList(Collection<T> entities, Function<T, Collection<R>> extractor) {
        Map<R, Long> map = flattenedCounts(entities, extractor);
        return map.entrySet().stream()
                .map(e -> new ValueCountDto<>(e.getKey(), e.getValue()))
                .sorted(Comparator.comparingLong(ValueCountDto<R>::getCount).reversed())
                .toList();
    }

    public static <T> IntRangeDto intRange(Collection<T> entities, Function<T, Integer> extractor) {
        if (entities == null || extractor == null) return null;
        List<Integer> values = entities.stream()
                .filter(Objects::nonNull)
                .map(extractor)
                .filter(Objects::nonNull)
                .toList();
        if (values.isEmpty()) return null;
        int min = values.stream().mapToInt(Integer::intValue).min().orElseThrow();
        int max = values.stream().mapToInt(Integer::intValue).max().orElseThrow();
        return new IntRangeDto(min, max);
    }

    public static <T> DateRangeDto dateRange(Collection<T> entities, Function<T, LocalDateTime> extractor) {
        if (entities == null || extractor == null) return null;
        List<LocalDateTime> values = entities.stream()
                .filter(Objects::nonNull)
                .map(extractor)
                .filter(Objects::nonNull)
                .toList();
        if (values.isEmpty()) return null;
        LocalDateTime min = values.stream().min(LocalDateTime::compareTo).orElse(null);
        LocalDateTime max = values.stream().max(LocalDateTime::compareTo).orElse(null);
        return new DateRangeDto(min, max);
    }

    public static <T> Set<Boolean> booleanStates(Collection<T> entities, Function<T, Boolean> extractor) {
        if (entities == null || extractor == null) return Collections.emptySet();
        return entities.stream()
                .filter(Objects::nonNull)
                .map(extractor)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
    }
}