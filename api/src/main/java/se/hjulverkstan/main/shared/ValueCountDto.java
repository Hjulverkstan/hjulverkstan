package se.hjulverkstan.main.shared;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ValueCountDto<V> {
    private V value;
    private long count;
}