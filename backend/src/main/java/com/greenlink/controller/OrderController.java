package com.greenlink.controller;

import com.greenlink.dto.OrderDto.*;
import com.greenlink.security.UserPrincipal;
import com.greenlink.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@AuthenticationPrincipal UserPrincipal currentUser,
                                                     @Valid @RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.createOrder(currentUser.getId(), request));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderResponse>> getMyOrders(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(orderService.getUserOrders(currentUser.getId()));
    }

    @GetMapping("/seller-orders")
    public ResponseEntity<List<OrderResponse>> getSellerOrders(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(orderService.getSellerSalesOrders(currentUser.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }
}
