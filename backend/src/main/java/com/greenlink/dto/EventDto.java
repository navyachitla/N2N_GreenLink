package com.greenlink.dto;

import com.greenlink.enums.EventStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class EventDto {

    public static class EcoEventDto {
        private Long id;

        @NotBlank(message = "Title is required")
        private String title;

        @NotBlank(message = "Description is required")
        private String description;

        @NotNull(message = "Event date is required")
        private LocalDate eventDate;

        private LocalTime eventTime;

        @NotBlank(message = "Location is required")
        private String location;

        @Min(value = 1, message = "Capacity must be at least 1")
        private int capacity;

        private int registeredCount;
        private String organizer;
        private EventStatus status = EventStatus.UPCOMING;
        private String imageUrl;
        private boolean registered;
        private LocalDateTime createdAt;

        public EcoEventDto() {}

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

        public LocalDate getEventDate() {
            return eventDate;
        }

        public void setEventDate(LocalDate eventDate) {
            this.eventDate = eventDate;
        }

        public LocalTime getEventTime() {
            return eventTime;
        }

        public void setEventTime(LocalTime eventTime) {
            this.eventTime = eventTime;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public int getCapacity() {
            return capacity;
        }

        public void setCapacity(int capacity) {
            this.capacity = capacity;
        }

        public int getRegisteredCount() {
            return registeredCount;
        }

        public void setRegisteredCount(int registeredCount) {
            this.registeredCount = registeredCount;
        }

        public String getOrganizer() {
            return organizer;
        }

        public void setOrganizer(String organizer) {
            this.organizer = organizer;
        }

        public EventStatus getStatus() {
            return status;
        }

        public void setStatus(EventStatus status) {
            this.status = status;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }

        public boolean isRegistered() {
            return registered;
        }

        public void setRegistered(boolean registered) {
            this.registered = registered;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
    }

    public static class EventRegistrationResponse {
        private Long id;
        private Long eventId;
        private String eventTitle;
        private Long userId;
        private LocalDateTime registeredAt;

        public EventRegistrationResponse() {}

        public EventRegistrationResponse(Long id, Long eventId, String eventTitle, Long userId, LocalDateTime registeredAt) {
            this.id = id;
            this.eventId = eventId;
            this.eventTitle = eventTitle;
            this.userId = userId;
            this.registeredAt = registeredAt;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getEventId() {
            return eventId;
        }

        public void setEventId(Long eventId) {
            this.eventId = eventId;
        }

        public String getEventTitle() {
            return eventTitle;
        }

        public void setEventTitle(String eventTitle) {
            this.eventTitle = eventTitle;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public LocalDateTime getRegisteredAt() {
            return registeredAt;
        }

        public void setRegisteredAt(LocalDateTime registeredAt) {
            this.registeredAt = registeredAt;
        }
    }
}
