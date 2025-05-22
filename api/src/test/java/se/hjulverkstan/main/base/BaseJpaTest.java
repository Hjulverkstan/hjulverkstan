package se.hjulverkstan.main.base;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.jdbc.core.JdbcTemplate;
import se.hjulverkstan.main.util.SequenceUtils;

@DataJpaTest
public class BaseJpaTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    void syncAllSequences() {
        SequenceUtils.resetAllSequences(jdbcTemplate);
    }

    protected boolean deleteRow(String table, String column, int id) {
        var query = "DELETE FROM " + table + " WHERE " + column + " = ?";
        return jdbcTemplate.update(query, id) == 1;
    }

}
