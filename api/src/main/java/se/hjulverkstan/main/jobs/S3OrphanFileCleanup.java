package se.hjulverkstan.main.jobs;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import se.hjulverkstan.main.repository.ImageRepositoryImpl;
import se.hjulverkstan.main.service.S3ServiceImpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class S3OrphanFileCleanup {
    private static final Logger logger = LoggerFactory.getLogger(S3OrphanFileCleanup.class);

    private static final int BATCH_SIZE = 100;

    private final ImageRepositoryImpl imageRepositoryImpl;
    private final S3ServiceImpl s3ServiceImpl;

    public S3OrphanFileCleanup(ImageRepositoryImpl imageRepositoryImpl, S3ServiceImpl s3Service) {
        this.imageRepositoryImpl = imageRepositoryImpl;
        this.s3ServiceImpl = s3Service;
    }

    @Scheduled(cron = "${cleanup.s3-orphan-files.cron}")
    public void runCleanup() {
        List<String> usedUrls = imageRepositoryImpl.getAllUsedS3URLs();
        List<String> allImageKeys = s3ServiceImpl.getAllImageKeys();

        Set<String> usedKeys = usedUrls.stream()
                        .map(s3ServiceImpl::extractKeyFromURL)
                        .collect(Collectors.toSet());

        List<String> orphanKeys = allImageKeys.stream()
                        .filter(key -> !usedKeys.contains(key))
                        .toList();

        logger.info("Found {} orphan files to delete", orphanKeys.size());

        deleteInBatches(orphanKeys);
    }

    private void deleteInBatches(List<String> keys) {
        List<List<String>> batches = new ArrayList<>();

        for (int i = 0; i < keys.size(); i += BATCH_SIZE) {
            batches.add(keys.subList(i, Math.min(keys.size(), i + BATCH_SIZE)));
        }

        batches.parallelStream().forEach(batch -> {
            try {
                s3ServiceImpl.deleteFilesByKeys(batch);
                logger.info("Deleted batch of orphan files: {}", batch);
            } catch (Exception e) {
                logger.error("Error deleting batch of orphan files: {}. Cause: {}", batch, e.getMessage(), e);
            }
        });
    }
}
