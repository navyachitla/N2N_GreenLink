package com.greenlink.repository;

import com.greenlink.entity.SustainabilityService;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SustainabilityServiceRepository extends JpaRepository<SustainabilityService, Long> {
    List<SustainabilityService> findByActiveTrue();
    List<SustainabilityService> findByCategoryContainingIgnoreCaseOrNameContainingIgnoreCase(String category, String name);
}
