package se.hjulverkstan.main.repository.webedit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import se.hjulverkstan.main.model.webedit.GeneralContent;

import java.util.List;
import java.util.Optional;

@Repository
public interface GeneralContentRepository extends JpaRepository<GeneralContent, Long> {
}
