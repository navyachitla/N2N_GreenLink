package com.greenlink.repository;

import com.greenlink.entity.Product;
import com.greenlink.enums.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStatus(ProductStatus status);
    List<Product> findBySellerId(Long sellerId);
    
    List<Product> findByStatusAndCategoryId(ProductStatus status, Long categoryId);

    @Query("SELECT p FROM Product p WHERE p.status = :status AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Product> searchProductsWithKeyword(@Param("status") ProductStatus status,
                                           @Param("categoryId") Long categoryId,
                                           @Param("search") String search);

    long countByStatus(ProductStatus status);
}
