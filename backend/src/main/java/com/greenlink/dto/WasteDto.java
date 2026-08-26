package com.greenlink.dto;

import com.greenlink.enums.WasteAction;
import com.greenlink.enums.WasteStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class WasteDto {

    public static class WasteSubmissionRequest {
        @NotBlank(message = "Waste type is required")
        private String wasteType;

        @NotBlank(message = "Description is required")
        private String description;

        private String imageUrl;
        private String quantity;
        private String location;

        @NotNull(message = "Preferred action is required")
        private WasteAction preferredAction;

        public WasteSubmissionRequest() {}

        public String getWasteType() {
            return wasteType;
        }

        public void setWasteType(String wasteType) {
            this.wasteType = wasteType;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }

        public String getQuantity() {
            return quantity;
        }

        public void setQuantity(String quantity) {
            this.quantity = quantity;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public WasteAction getPreferredAction() {
            return preferredAction;
        }

        public void setPreferredAction(WasteAction preferredAction) {
            this.preferredAction = preferredAction;
        }
    }

    public static class WasteSubmissionResponse {
        private Long id;
        private Long userId;
        private String userName;
        private String wasteType;
        private String description;
        private String imageUrl;
        private String quantity;
        private String location;
        private WasteAction preferredAction;
        private WasteStatus status;
        private String adminNotes;
        private LocalDateTime createdAt;

        public WasteSubmissionResponse() {}

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }

        public String getWasteType() {
            return wasteType;
        }

        public void setWasteType(String wasteType) {
            this.wasteType = wasteType;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }

        public String getQuantity() {
            return quantity;
        }

        public void setQuantity(String quantity) {
            this.quantity = quantity;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public WasteAction getPreferredAction() {
            return preferredAction;
        }

        public void setPreferredAction(WasteAction preferredAction) {
            this.preferredAction = preferredAction;
        }

        public WasteStatus getStatus() {
            return status;
        }

        public void setStatus(WasteStatus status) {
            this.status = status;
        }

        public String getAdminNotes() {
            return adminNotes;
        }

        public void setAdminNotes(String adminNotes) {
            this.adminNotes = adminNotes;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
    }

    public static class WasteStatusUpdateRequest {
        @NotNull(message = "Status is required")
        private WasteStatus status;
        private String adminNotes;

        public WasteStatusUpdateRequest() {}

        public WasteStatus getStatus() {
            return status;
        }

        public void setStatus(WasteStatus status) {
            this.status = status;
        }

        public String getAdminNotes() {
            return adminNotes;
        }

        public void setAdminNotes(String adminNotes) {
            this.adminNotes = adminNotes;
        }
    }
}
