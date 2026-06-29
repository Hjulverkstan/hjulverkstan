package se.hjulverkstan.main.feature.statistic;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

@Repository
public class StatisticRepository {
    @PersistenceContext
    private EntityManager entityManager;

    public long getBaselineValue(StatisticKey key) {
        Number value = (Number) entityManager.createNativeQuery("""
                SELECT COALESCE(SUM(value), 0)
                FROM statistic_baseline
                WHERE statistic_key = :key
                """)
                .setParameter("key", key.name())
                .getSingleResult();

        return value.longValue();
    }

    public void saveLiveValue(StatisticKey key, long value) {
        entityManager.createNativeQuery("""
                INSERT INTO statistic (statistic_key, value, updated_at)
                VALUES (:key, :value, NOW())
                ON CONFLICT (statistic_key)
                DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
                """)
                .setParameter("key", key.name())
                .setParameter("value", value)
                .executeUpdate();
    }

    public long countLiveRepaired() {
        return count("""
                SELECT COUNT(*)
                FROM ticket_vehicle tv
                JOIN ticket t ON t.id = tv.ticket_id
                WHERE t.deleted = false
                  AND t.ticket_type = 'REPAIR'
                  AND t.ticket_status IN ('COMPLETE', 'CLOSED')
                  AND EXTRACT(YEAR FROM COALESCE(t.status_updated_at, t.updated_at, t.created_at)) = EXTRACT(YEAR FROM CURRENT_DATE)
                """);
    }

    public long countLiveHired() {
        return count("""
                SELECT COUNT(*)
                FROM ticket_vehicle tv
                JOIN ticket t ON t.id = tv.ticket_id
                WHERE t.deleted = false
                  AND t.ticket_type = 'RENT'
                  AND t.ticket_status IN ('IN_PROGRESS', 'CLOSED')
                  AND t.start_date IS NOT NULL
                  AND EXTRACT(YEAR FROM t.start_date) = EXTRACT(YEAR FROM CURRENT_DATE)
                """);
    }

    public long countLiveSaved() {
        return count("""
                SELECT COUNT(*)
                FROM ticket_vehicle tv
                JOIN ticket t ON t.id = tv.ticket_id
                WHERE t.deleted = false
                  AND t.ticket_type IN ('DONATE', 'RECEIVE')
                  AND EXTRACT(YEAR FROM t.created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
                """);
    }

    private long count(String query) {
        Number value = (Number) entityManager.createNativeQuery(query).getSingleResult();
        return value.longValue();
    }
}
