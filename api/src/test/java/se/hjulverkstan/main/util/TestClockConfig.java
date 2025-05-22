package se.hjulverkstan.main.util;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

import java.time.Clock;
import java.time.LocalDateTime;
import java.time.ZoneId;

// @TestConfiguration
public class TestClockConfig {
    // @Bean
    // @Primary
    public Clock testClock() {
        return Clock.fixed(
                LocalDateTime.of(2025, 6, 3, 12, 0)
                        .atZone(ZoneId.systemDefault())
                        .toInstant(),
                ZoneId.systemDefault()
        );
    }
}