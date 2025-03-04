package se.hjulverkstan.main.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Repository
@Transactional
public class ImageRepositoryImpl implements ImageRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void deleteSpecificS3URLFromAllEntities(String fileKey) {
//        List<String> usedUrls = getAllUsedS3URLs(); // Hämta alla använda URLs
//
//        if (!usedUrls.contains(fileKey)) {
//            System.out.println("File key not found in database, skipping deletion from database.");
//            return;
//        }

        entityManager.createNativeQuery("UPDATE vehicle SET imageURL = NULL WHERE imageURL LIKE CONCAT('%', :fileKey)")
                .setParameter("fileKey", fileKey)
                .executeUpdate();

        entityManager.createNativeQuery("UPDATE Shop SET imageURL = NULL WHERE imageURL LIKE CONCAT('%', :fileKey)")
                .setParameter("fileKey", fileKey)
                .executeUpdate();

        entityManager.createNativeQuery("UPDATE event SET imageURL = NULL WHERE imageURL LIKE CONCAT('%', :fileKey)")
                .setParameter("fileKey", fileKey)
                .executeUpdate();

        entityManager.createNativeQuery("UPDATE blog SET imageURL = NULL WHERE imageURL LIKE CONCAT('%', :fileKey)")
                .setParameter("fileKey", fileKey)
                .executeUpdate();

        entityManager.createNativeQuery("UPDATE General_Content SET imageURL = NULL WHERE imageURL LIKE CONCAT('%', :fileKey)")
                .setParameter("fileKey", fileKey)
                .executeUpdate();
    }

    @Override
    public List<String> getAllUsedS3URLs() {
        List<String> vehicleUrls = entityManager.createNativeQuery("SELECT imageURL FROM vehicle").getResultList();
        List<String> shopUrls = entityManager.createNativeQuery("SELECT imageURL FROM Shop").getResultList();
        List<String> eventUrls = entityManager.createNativeQuery("SELECT imageURL FROM event").getResultList();
        List<String> blogUrls = entityManager.createNativeQuery("SELECT imageURL FROM blog").getResultList();
        List<String> generalContentUrls = entityManager.createNativeQuery("SELECT imageURL FROM General_Content").getResultList();

        Set<String> urls = new HashSet<>();
        if(vehicleUrls != null) {
            urls.addAll(vehicleUrls);
        }
        if(shopUrls != null) {
            urls.addAll(shopUrls);
        }
        if(eventUrls != null) {
            urls.addAll(eventUrls);
        }
        if(blogUrls != null) {
            urls.addAll(blogUrls);
        }
        if(generalContentUrls != null) {
            urls.addAll(generalContentUrls);
        }
        urls.remove(null);
        return new ArrayList<>(urls);
    }

}
