package se.hjulverkstan.main.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import java.util.stream.Collectors;

@Repository
@Transactional
public class ImageRepositoryImpl implements ImageRepository {

    @PersistenceContext
    private EntityManager entityManager;

    private static final List<String> imageEntities = List.of("vehicle", "Shop", "General_Content");

    @Override
    public void deleteSpecificS3URLFromAllEntities(String fileKey) {
        for (String entity : imageEntities) {
            entityManager.createNativeQuery(
                            "UPDATE " + entity + " SET imageURL = NULL WHERE imageURL LIKE CONCAT('%', :fileKey)")
                    .setParameter("fileKey", fileKey)
                    .executeUpdate();
        }
    }

    @Override
    public List<String> getAllUsedS3URLs() {
        String unionQuery = imageEntities.stream()
                .map(entity -> "SELECT imageURL FROM " + entity + " WHERE imageURL IS NOT NULL")
                .collect(Collectors.joining(" UNION "));
        return entityManager.createNativeQuery(unionQuery).getResultList();
    }
}
