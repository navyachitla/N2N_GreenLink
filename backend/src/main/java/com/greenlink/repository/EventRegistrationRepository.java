package com.greenlink.repository;

import com.greenlink.entity.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    List<EventRegistration> findByUserId(Long userId);
    List<EventRegistration> findByEventId(Long eventId);
    Optional<EventRegistration> findByUserIdAndEventId(Long userId, Long eventId);
    boolean existsByUserIdAndEventId(Long userId, Long eventId);
}
