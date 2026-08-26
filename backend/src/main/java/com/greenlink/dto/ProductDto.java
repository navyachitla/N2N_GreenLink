package com.greenlink.dto;

import com.greenlink.enums.ProductStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductDto {

    public static class ProductRequest {
        @NotBlank(message = "Product name is required")
        private String name;

        @NotBlank(message = "Description is required")
        private String description;

        @NotNull(message = "Category is required")
        private Long categoryId;

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.01", message = "Price must be greater than 0")
        private BigDecimal price;

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;

        private String imageUrl;
        private String sustainabilityInfo;
        private String condition;
        private String location;

        public ProductRequest() {}

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

        public String getSustainabilityInfo() { return sustainabilityInfo; }
        public void setSustainabilityInfo(String sustainabilityInfo) { this.sustainabilityInfo = sustainabilityInfo; }

        public String getCondition() { return condition; }
        public void setCondition(String condition) { this.condition = condition; }

        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
    }

    public static class ProductResponse {
        private Long id;
        private String name;
        private String description;
        private Long categoryId;
        private String categoryName;
        private BigDecimal price;
        private Integer quantity;
        private String imageUrl;
        private String sustainabilityInfo;
        private String condition;
        private String location;
        private ProductStatus status;
        private Long sellerId;
        private String sellerName;
        private String rejectionReason;
        private Double averageRating;
        private Long reviewCount;
        private LocalDateTime createdAt;

        public ProductResponse() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

        public String getSustainabilityInfo() { return sustainabilityInfo; }
        public void setSustainabilityInfo(String sustainabilityInfo) { this.sustainabilityInfo = sustainabilityInfo; }

        public String getCondition() { return condition; }
        public void setCondition(String condition) { this.condition = condition; }

        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }

        public ProductStatus getStatus() { return status; }
        public void setStatus(ProductStatus status) { this.status = status; }

        public Long getSellerId() { return sellerId; }
        public void setSellerId(Long sellerId) { this.sellerId = sellerId; }

        public String getSellerName() { return sellerName; }
        public void setSellerName(String sellerName) { this.sellerName = sellerName; }

        public String getRejectionReason() { return rejectionReason; }
        public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

        public Double getAverageRating() { return averageRating; }
        public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

        public Long getReviewCount() { return reviewCount; }
        public void setReviewCount(Long reviewCount) { this.reviewCount = reviewCount; }

        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }

    public static class CategoryDto {
        private Long id;
        private String name;
        private String description;
        private String icon;

        public CategoryDto() {}

        public CategoryDto(Long id, String name, String description, String icon) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.icon = icon;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getIcon() { return icon; }
        public void setIcon(String icon) { this.icon = icon; }
    }

    public static class ReviewRequest {
        @NotNull
        @Min(1)
        @Max(5)
        private Integer rating;

        @NotBlank
        private String comment;

        public ReviewRequest() {}

        public Integer getRating() { return rating; }
        public void setRating(Integer rating) { this.rating = rating; }

        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
    }

    public static class ReviewResponse {
        private Long id;
        private Long productId;
        private Long userId;
        private String userName;
        private Integer rating;
        private String comment;
        private LocalDateTime createdAt;

        public ReviewResponse() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }

        public Integer getRating() { return rating; }
        public void setRating(Integer rating) { this.rating = rating; }

        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }

        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }
}
