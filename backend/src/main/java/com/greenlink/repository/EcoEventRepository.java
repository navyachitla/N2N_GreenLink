package com.greenlink.repository;

import com.greenlink.entity.EcoEvent;
import com.greenlink.enums.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EcoEventRepository extends JpaRepository<EcoEvent, Long> {
    List<EcoEvent> findByStatusOrderByEventDateAsc(EventStatus status);
    List<EcoEvent> findAllByOrderByEventDateAsc();
}
