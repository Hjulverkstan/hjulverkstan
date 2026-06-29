package se.hjulverkstan.main.feature.statistic;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.shared.ListResponseDto;

import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class StatisticService {
    private final StatisticRepository statisticRepository;

    @Transactional
    public ListResponseDto<StatisticDto> getStatistic() {
        return new ListResponseDto<>(Arrays.stream(StatisticKey.values())
                .map(key -> new StatisticDto(key, getValue(key)))
                .toList());
    }

    private long getValue(StatisticKey key) {
        long liveValue = getLiveValue(key);
        statisticRepository.saveLiveValue(key, liveValue);

        return statisticRepository.getBaselineValue(key) + liveValue;
    }

    private long getLiveValue(StatisticKey key) {
        return switch (key) {
            case REPAIRED -> statisticRepository.countLiveRepaired();
            case HIRED -> statisticRepository.countLiveHired();
            case SAVED -> statisticRepository.countLiveSaved();
        };
    }
}
