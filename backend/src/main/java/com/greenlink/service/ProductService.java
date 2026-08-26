package com.greenlink.service;

import com.greenlink.dto.ProductDto.*;
import com.greenlink.entity.Category;
import com.greenlink.entity.Product;
import com.greenlink.entity.ProductReview;
import com.greenlink.entity.User;
import com.greenlink.enums.ProductStatus;
import com.greenlink.exception.ForbiddenException;
import com.greenlink.exception.ResourceNotFoundException;
import com.greenlink.repository.CategoryRepository;
import com.greenlink.repository.ProductRepository;
import com.greenlink.repository.ProductReviewRepository;
import com.greenlink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductReviewRepository reviewRepository;

    @Autowired
    private RewardService rewardService;

    public List<ProductResponse> getApprovedProducts(Long categoryId, String search) {
        List<Product> products;
        if (search != null && !search.trim().isEmpty()) {
            products = productRepository.searchProductsWithKeyword(ProductStatus.APPROVED, categoryId, search.trim());
        } else if (categoryId != null) {
            products = productRepository.findByStatusAndCategoryId(ProductStatus.APPROVED, categoryId);
        } else {
            products = productRepository.findByStatus(ProductStatus.APPROVED);
        }
        return products.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + id));
        return mapToResponse(product);
    }

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(c -> new CategoryDto(c.getId(), c.getName(), c.getDescription(), c.getIcon()))
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResponse createProduct(Long sellerId, ProductRequest request) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller user not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Product product = new Product();
        product.setSeller(seller);
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(category);
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setImageUrl(request.getImageUrl());
        product.setSustainabilityInfo(request.getSustainabilityInfo());
        product.setCondition(request.getCondition());
        product.setLocation(request.getLocation());
        product.setStatus(ProductStatus.PENDING);

        product = productRepository.save(product);

        // Reward points for listing eco-friendly product
        rewardService.addPoints(seller, 20, "LIST_PRODUCT", "Listed sustainable product: " + product.getName());

        return mapToResponse(product);
    }

    @Transactional
    public ProductResponse updateProduct(Long productId, Long userId, ProductRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!product.getSeller().getId().equals(userId)) {
            throw new ForbiddenException("You are not authorized to update this product listing");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(category);
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        if (request.getImageUrl() != null && !request.getImageUrl().isEmpty()) {
            product.setImageUrl(request.getImageUrl());
        }
        product.setSustainabilityInfo(request.getSustainabilityInfo());
        product.setCondition(request.getCondition());
        product.setLocation(request.getLocation());

        product = productRepository.save(product);
        return mapToResponse(product);
    }

    @Transactional
    public void deleteProduct(Long productId, Long userId, boolean isAdmin) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!isAdmin && !product.getSeller().getId().equals(userId)) {
            throw new ForbiddenException("You are not authorized to delete this product listing");
        }

        productRepository.delete(product);
    }

    public List<ProductResponse> getSellerProducts(Long sellerId) {
        return productRepository.findBySellerId(sellerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Product Review Operations
    @Transactional
    public ReviewResponse addProductReview(Long productId, Long userId, ReviewRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ProductReview review = new ProductReview(product, user, request.getRating(), request.getComment());
        review = reviewRepository.save(review);

        // Award +10 points for leaving product review
        rewardService.addPoints(user, 10, "PRODUCT_REVIEW", "Reviewed product: " + product.getName());

        return mapToReviewResponse(review);
    }

    public List<ReviewResponse> getProductReviews(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(this::mapToReviewResponse)
                .collect(Collectors.toList());
    }

    // Admin Operations
    public List<ProductResponse> getPendingProducts() {
        return productRepository.findByStatus(ProductStatus.PENDING).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getAllProductsForAdmin() {
        return productRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResponse updateProductStatus(Long productId, ProductStatus status, String rejectionReason) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        product.setStatus(status);
        if (status == ProductStatus.REJECTED) {
            product.setRejectionReason(rejectionReason);
        } else {
            product.setRejectionReason(null);
        }

        product = productRepository.save(product);
        return mapToResponse(product);
    }

    private ProductResponse mapToResponse(Product product) {
        ProductResponse res = new ProductResponse();
        res.setId(product.getId());
        res.setName(product.getName());
        res.setDescription(product.getDescription());
        if (product.getCategory() != null) {
            res.setCategoryId(product.getCategory().getId());
            res.setCategoryName(product.getCategory().getName());
        }
        res.setPrice(product.getPrice());
        res.setQuantity(product.getQuantity());
        res.setImageUrl(product.getImageUrl());
        res.setSustainabilityInfo(product.getSustainabilityInfo());
        res.setCondition(product.getCondition());
        res.setLocation(product.getLocation());
        res.setStatus(product.getStatus());
        if (product.getSeller() != null) {
            res.setSellerId(product.getSeller().getId());
            res.setSellerName(product.getSeller().getFullName());
        }
        res.setRejectionReason(product.getRejectionReason());
        res.setCreatedAt(product.getCreatedAt());

        // Attach Average Rating & Review Count
        Double avg = reviewRepository.findAverageRatingByProductId(product.getId());
        long count = reviewRepository.countByProductId(product.getId());
        res.setAverageRating(avg != null ? Math.round(avg * 10.0) / 10.0 : 5.0);
        res.setReviewCount(count > 0 ? count : 1L);

        return res;
    }

    private ReviewResponse mapToReviewResponse(ProductReview review) {
        ReviewResponse res = new ReviewResponse();
        res.setId(review.getId());
        res.setProductId(review.getProduct().getId());
        res.setUserId(review.getUser().getId());
        res.setUserName(review.getUser().getFullName());
        res.setRating(review.getRating());
        res.setComment(review.getComment());
        res.setCreatedAt(review.getCreatedAt());
        return res;
    }
}
