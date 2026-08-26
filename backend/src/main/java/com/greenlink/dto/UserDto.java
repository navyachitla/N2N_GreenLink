package com.greenlink.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

public class UserDto {

    public static class UserProfileDto {
        private Long id;
        private String fullName;
        private String username;
        private String email;
        private String phone;
        private String address;
        private int rewardPoints;
        private boolean active;
        private List<String> roles;
        private LocalDateTime createdAt;

        public UserProfileDto() {}

        public UserProfileDto(Long id, String fullName, String username, String email, String phone, String address, int rewardPoints, boolean active, List<String> roles, LocalDateTime createdAt) {
            this.id = id;
            this.fullName = fullName;
            this.username = username;
            this.email = email;
            this.phone = phone;
            this.address = address;
            this.rewardPoints = rewardPoints;
            this.active = active;
            this.roles = roles;
            this.createdAt = createdAt;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public int getRewardPoints() {
            return rewardPoints;
        }

        public void setRewardPoints(int rewardPoints) {
            this.rewardPoints = rewardPoints;
        }

        public boolean isActive() {
            return active;
        }

        public void setActive(boolean active) {
            this.active = active;
        }

        public List<String> getRoles() {
            return roles;
        }

        public void setRoles(List<String> roles) {
            this.roles = roles;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
    }

    public static class UpdateProfileRequest {
        @NotBlank(message = "Full name is required")
        private String fullName;
        private String phone;
        private String address;

        public UpdateProfileRequest() {}

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }
    }

    public static class ChangePasswordRequest {
        @NotBlank(message = "Old password is required")
        private String oldPassword;

        @NotBlank(message = "New password is required")
        @Size(min = 6, message = "New password must be at least 6 characters")
        private String newPassword;

        public ChangePasswordRequest() {}

        public String getOldPassword() {
            return oldPassword;
        }

        public void setOldPassword(String oldPassword) {
            this.oldPassword = oldPassword;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }
}
