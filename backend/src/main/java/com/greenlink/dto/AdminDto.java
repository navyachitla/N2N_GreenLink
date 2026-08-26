package com.greenlink.dto;

import com.greenlink.enums.ProductStatus;
import jakarta.validation.constraints.NotNull;

public class AdminDto {

    public static class AdminDashboardStats {
        private long totalUsers;
        private long activeUsers;
        private long totalProducts;
        private long pendingProducts;
        private long approvedProducts;
        private long totalOrders;
        private long totalWasteSubmissions;
        private long pendingWasteRequests;
        private long totalCommunityPosts;
        private long totalEcoEvents;
        private long totalRewardPointsAwarded;

        public AdminDashboardStats() {}

        public long getTotalUsers() {
            return totalUsers;
        }

        public void setTotalUsers(long totalUsers) {
            this.totalUsers = totalUsers;
        }

        public long getActiveUsers() {
            return activeUsers;
        }

        public void setActiveUsers(long activeUsers) {
            this.activeUsers = activeUsers;
        }

        public long getTotalProducts() {
            return totalProducts;
        }

        public void setTotalProducts(long totalProducts) {
            this.totalProducts = totalProducts;
        }

        public long getPendingProducts() {
            return pendingProducts;
        }

        public void setPendingProducts(long pendingProducts) {
            this.pendingProducts = pendingProducts;
        }

        public long getApprovedProducts() {
            return approvedProducts;
        }

        public void setApprovedProducts(long approvedProducts) {
            this.approvedProducts = approvedProducts;
        }

        public long getTotalOrders() {
            return totalOrders;
        }

        public void setTotalOrders(long totalOrders) {
            this.totalOrders = totalOrders;
        }

        public long getTotalWasteSubmissions() {
            return totalWasteSubmissions;
        }

        public void setTotalWasteSubmissions(long totalWasteSubmissions) {
            this.totalWasteSubmissions = totalWasteSubmissions;
        }

        public long getPendingWasteRequests() {
            return pendingWasteRequests;
        }

        public void setPendingWasteRequests(long pendingWasteRequests) {
            this.pendingWasteRequests = pendingWasteRequests;
        }

        public long getTotalCommunityPosts() {
            return totalCommunityPosts;
        }

        public void setTotalCommunityPosts(long totalCommunityPosts) {
            this.totalCommunityPosts = totalCommunityPosts;
        }

        public long getTotalEcoEvents() {
            return totalEcoEvents;
        }

        public void setTotalEcoEvents(long totalEcoEvents) {
            this.totalEcoEvents = totalEcoEvents;
        }

        public long getTotalRewardPointsAwarded() {
            return totalRewardPointsAwarded;
        }

        public void setTotalRewardPointsAwarded(long totalRewardPointsAwarded) {
            this.totalRewardPointsAwarded = totalRewardPointsAwarded;
        }
    }

    public static class ProductApprovalRequest {
        @NotNull(message = "Status is required")
        private ProductStatus status;
        private String rejectionReason;

        public ProductApprovalRequest() {}

        public ProductStatus getStatus() {
            return status;
        }

        public void setStatus(ProductStatus status) {
            this.status = status;
        }

        public String getRejectionReason() {
            return rejectionReason;
        }

        public void setRejectionReason(String rejectionReason) {
            this.rejectionReason = rejectionReason;
        }
    }
}
