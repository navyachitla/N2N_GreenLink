package com.greenlink.repository;

import com.greenlink.entity.WasteSubmission;
import com.greenlink.enums.WasteStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WasteSubmissionRepository extends JpaRepository<WasteSubmission, Long> {
    List<WasteSubmission> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<WasteSubmission> findByStatus(WasteStatus status);
    long countByStatus(WasteStatus status);
}
