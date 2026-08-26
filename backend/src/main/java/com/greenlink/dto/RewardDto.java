package com.greenlink.dto;

import java.time.LocalDateTime;
import java.util.List;

public class RewardDto {

    public static class RewardTransactionDto {
        private Long id;
        private int points;
        private String activityType;
        private String description;
        private LocalDateTime timestamp;

        public RewardTransactionDto() {}

        public RewardTransactionDto(Long id, int points, String activityType, String description, LocalDateTime timestamp) {
            this.id = id;
            this.points = points;
            this.activityType = activityType;
            this.description = description;
            this.timestamp = timestamp;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public int getPoints() {
            return points;
        }

        public void setPoints(int points) {
            this.points = points;
        }

        public String getActivityType() {
            return activityType;
        }

        public void setActivityType(String activityType) {
            this.activityType = activityType;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public LocalDateTime getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
        }
    }

    public static class BadgeDto {
        private Long id;
        private String code;
        private String name;
        private String description;
        private String iconUrl;
        private int pointsRequired;
        private boolean earned;
        private LocalDateTime earnedAt;

        public BadgeDto() {}

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getIconUrl() {
            return iconUrl;
        }

        public void setIconUrl(String iconUrl) {
            this.iconUrl = iconUrl;
        }

        public int getPointsRequired() {
            return pointsRequired;
        }

        public void setPointsRequired(int pointsRequired) {
            this.pointsRequired = pointsRequired;
        }

        public boolean isEarned() {
            return earned;
        }

        public void setEarned(boolean earned) {
            this.earned = earned;
        }

        public LocalDateTime getEarnedAt() {
            return earnedAt;
        }

        public void setEarnedAt(LocalDateTime earnedAt) {
            this.earnedAt = earnedAt;
        }
    }

    public static class RewardSummaryResponse {
        private int totalPoints;
        private List<RewardTransactionDto> transactions;
        private List<BadgeDto> badges;

        public RewardSummaryResponse() {}

        public RewardSummaryResponse(int totalPoints, List<RewardTransactionDto> transactions, List<BadgeDto> badges) {
            this.totalPoints = totalPoints;
            this.transactions = transactions;
            this.badges = badges;
        }

        public int getTotalPoints() {
            return totalPoints;
        }

        public void setTotalPoints(int totalPoints) {
            this.totalPoints = totalPoints;
        }

        public List<RewardTransactionDto> getTransactions() {
            return transactions;
        }

        public void setTransactions(List<RewardTransactionDto> transactions) {
            this.transactions = transactions;
        }

        public List<BadgeDto> getBadges() {
            return badges;
        }

        public void setBadges(List<BadgeDto> badges) {
            this.badges = badges;
        }
    }
}
