package com.greenlink.repository;

import com.greenlink.entity.LearningResource;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LearningResourceRepository extends JpaRepository<LearningResource, Long> {
    List<LearningResource> findByCategory(String category);
    List<LearningResource> findByTitleContainingIgnoreCaseOrCategoryContainingIgnoreCase(String title, String category);
}
