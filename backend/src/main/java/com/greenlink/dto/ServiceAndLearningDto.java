package com.greenlink.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class ServiceAndLearningDto {

    public static class SustainabilityServiceDto {
        private Long id;

        @NotBlank(message = "Service name is required")
        private String name;

        @NotBlank(message = "Description is required")
        private String description;

        @NotBlank(message = "Category is required")
        private String category;

        private String location;
        private String contactInfo;
        private String availability;
        private String imageUrl;
        private boolean active = true;
        private LocalDateTime createdAt;

        public SustainabilityServiceDto() {}

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
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

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public String getContactInfo() {
            return contactInfo;
        }

        public void setContactInfo(String contactInfo) {
            this.contactInfo = contactInfo;
        }

        public String getAvailability() {
            return availability;
        }

        public void setAvailability(String availability) {
            this.availability = availability;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }

        public boolean isActive() {
            return active;
        }

        public void setActive(boolean active) {
            this.active = active;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
    }

    public static class LearningResourceDto {
        private Long id;

        @NotBlank(message = "Title is required")
        private String title;

        @NotBlank(message = "Description is required")
        private String description;

        @NotBlank(message = "Category is required")
        private String category;

        @NotBlank(message = "Content is required")
        private String content;

        private String imageUrl;
        private String externalReference;
        private LocalDateTime createdAt;

        public LearningResourceDto() {}

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }

        public String getExternalReference() {
            return externalReference;
        }

        public void setExternalReference(String externalReference) {
            this.externalReference = externalReference;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
    }
}
