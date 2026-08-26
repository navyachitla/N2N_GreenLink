package com.greenlink.entity;

import com.greenlink.enums.WasteAction;
import com.greenlink.enums.WasteStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "waste_submissions")
public class WasteSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String wasteType;

    @Column(length = 1500, nullable = false)
    private String description;

    private String imageUrl;
    private String quantity;
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private WasteAction preferredAction;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private WasteStatus status = WasteStatus.SUBMITTED;

    @Column(length = 500)
    private String adminNotes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public WasteSubmission() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
