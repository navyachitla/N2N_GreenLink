package com.greenlink.repository;

import com.greenlink.entity.CarbonFootprint;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CarbonFootprintRepository extends JpaRepository<CarbonFootprint, Long> {
    List<CarbonFootprint> findByUserIdOrderByCalculationDateDesc(Long userId);
    Optional<CarbonFootprint> findFirstByUserIdOrderByCalculationDateDesc(Long userId);
}
