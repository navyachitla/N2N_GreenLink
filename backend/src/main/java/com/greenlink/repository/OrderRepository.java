package com.greenlink.repository;

import com.greenlink.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT DISTINCT o FROM Order o JOIN o.items item WHERE item.product.seller.id = :sellerId ORDER BY o.createdAt DESC")
    List<Order> findSellerSalesOrders(@Param("sellerId") Long sellerId);
}
