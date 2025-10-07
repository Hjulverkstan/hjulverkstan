package se.hjulverkstan.main.shared;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FilteredResponseDto<T, F> {
    private List<T> content;
    private F filter;
}