package se.hjulverkstan.main.util;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

// @TestConfiguration
public class FixedClockConfig {

    public static final LocalDateTime FIXED_NOW = LocalDateTime.of(2025, 6, 3, 12, 0);
    private static final ZoneId ZONE = ZoneId.systemDefault();

    // @Bean
    public Clock clock() {
        return Clock.fixed(FIXED_NOW.atZone(ZONE).toInstant(), ZONE);
    }
}
