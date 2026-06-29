package se.hjulverkstan.main.feature.statistic;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatisticDto {
    private StatisticKey key;
    private long value;
}
