package se.hjulverkstan.main.feature.webedit.shop;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShopRepository extends JpaRepository<Shop, Long> {
    boolean existsByLocation_Id(Long id);
    List<Shop> findAllByArchivedFalse(Sort createdAt);
}