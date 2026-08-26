package com.greenlink.repository;

import com.greenlink.entity.RewardTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RewardTransactionRepository extends JpaRepository<RewardTransaction, Long> {
    List<RewardTransaction> findByUserIdOrderByTimestampDesc(Long userId);
}
