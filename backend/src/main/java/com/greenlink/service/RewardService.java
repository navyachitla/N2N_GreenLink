package com.greenlink.service;

import com.greenlink.dto.RewardDto.*;
import com.greenlink.entity.Badge;
import com.greenlink.entity.RewardTransaction;
import com.greenlink.entity.User;
import com.greenlink.entity.UserBadge;
import com.greenlink.repository.BadgeRepository;
import com.greenlink.repository.RewardTransactionRepository;
import com.greenlink.repository.UserBadgeRepository;
import com.greenlink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RewardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RewardTransactionRepository rewardTransactionRepository;

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private UserBadgeRepository userBadgeRepository;

    @Transactional
    public void addPoints(User user, int points, String activityType, String description) {
        if (points <= 0) return;

        user.setRewardPoints(user.getRewardPoints() + points);
        userRepository.save(user);

        RewardTransaction transaction = new RewardTransaction(user, points, activityType, description);
        rewardTransactionRepository.save(transaction);

        // Check badge eligibility
        checkAndAwardBadges(user);
    }

    @Transactional
    public void checkAndAwardBadges(User user) {
        List<Badge> allBadges = badgeRepository.findAll();
        for (Badge badge : allBadges) {
            if (user.getRewardPoints() >= badge.getPointsRequired()) {
                if (!userBadgeRepository.existsByUserIdAndBadgeId(user.getId(), badge.getId())) {
                    UserBadge userBadge = new UserBadge(user, badge);
                    userBadgeRepository.save(userBadge);
                }
            }
        }
    }

    public RewardSummaryResponse getUserRewardSummary(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<RewardTransaction> transactions = rewardTransactionRepository.findByUserIdOrderByTimestampDesc(userId);
        List<RewardTransactionDto> transactionDtos = transactions.stream()
                .map(t -> new RewardTransactionDto(t.getId(), t.getPoints(), t.getActivityType(), t.getDescription(), t.getTimestamp()))
                .collect(Collectors.toList());

        List<Badge> allBadges = badgeRepository.findAll();
        List<UserBadge> userBadges = userBadgeRepository.findByUserId(userId);

        List<BadgeDto> badgeDtos = new ArrayList<>();
        for (Badge b : allBadges) {
            BadgeDto dto = new BadgeDto();
            dto.setId(b.getId());
            dto.setCode(b.getCode());
            dto.setName(b.getName());
            dto.setDescription(b.getDescription());
            dto.setIconUrl(b.getIconUrl());
            dto.setPointsRequired(b.getPointsRequired());

            UserBadge ub = userBadges.stream().filter(u -> u.getBadge().getId().equals(b.getId())).findFirst().orElse(null);
            if (ub != null) {
                dto.setEarned(true);
                dto.setEarnedAt(ub.getEarnedAt());
            } else {
                dto.setEarned(false);
            }
            badgeDtos.add(dto);
        }

        return new RewardSummaryResponse(user.getRewardPoints(), transactionDtos, badgeDtos);
    }
}
