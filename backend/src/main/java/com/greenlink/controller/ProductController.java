package com.greenlink.controller;

import com.greenlink.dto.AuthDto.MessageResponse;
import com.greenlink.dto.ProductDto.*;
import com.greenlink.security.UserPrincipal;
import com.greenlink.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getApprovedProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(productService.getApprovedProducts(categoryId, search));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        return ResponseEntity.ok(productService.getAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@AuthenticationPrincipal UserPrincipal currentUser,
                                                          @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.createProduct(currentUser.getId(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable Long id,
                                                          @AuthenticationPrincipal UserPrincipal currentUser,
                                                          @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, currentUser.getId(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteProduct(@PathVariable Long id,
                                                          @AuthenticationPrincipal UserPrincipal currentUser) {
        boolean isAdmin = currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        productService.deleteProduct(id, currentUser.getId(), isAdmin);
        return ResponseEntity.ok(new MessageResponse("Product deleted successfully", true));
    }

    @GetMapping("/my-listings")
    public ResponseEntity<List<ProductResponse>> getMyListings(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(productService.getSellerProducts(currentUser.getId()));
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<ReviewResponse> addProductReview(@PathVariable Long id,
                                                            @AuthenticationPrincipal UserPrincipal currentUser,
                                                            @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(productService.addProductReview(id, currentUser.getId(), request));
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<ReviewResponse>> getProductReviews(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductReviews(id));
    }
}
