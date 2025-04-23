package se.hjulverkstan.main.repository.webedit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import se.hjulverkstan.main.model.webedit.Story;
@Repository
public interface StoryRepository extends JpaRepository<Story, Long> {
}
