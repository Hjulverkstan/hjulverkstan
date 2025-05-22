package se.hjulverkstan.main.util;

import org.hibernate.annotations.SecondaryRow;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.LocalDateTime;

@Service
public record LocalDateTimeService(Clock clock) {

    public LocalDateTime currentDateTime() {
        return LocalDateTime.now(clock);
    }
}
