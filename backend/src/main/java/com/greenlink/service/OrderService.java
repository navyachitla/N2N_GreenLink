package com.greenlink.service;

import com.greenlink.dto.OrderDto.*;
import com.greenlink.entity.Order;
import com.greenlink.entity.OrderItem;
import com.greenlink.entity.Product;
import com.greenlink.entity.User;
import com.greenlink.enums.OrderStatus;
import com.greenlink.enums.ProductStatus;
import com.greenlink.exception.InvalidOperationException;
import com.greenlink.exception.ResourceNotFoundException;
import com.greenlink.repository.OrderRepository;
import com.greenlink.repository.ProductRepository;
import com.greenlink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RewardService rewardService;

    @Transactional
    public OrderResponse createOrder(Long userId, OrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new InvalidOperationException("Order must contain at least one product item");
        }

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(request.getShippingAddress());
        order.setContactPhone(request.getContactPhone());
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "SIMULATED_PAYMENT");
        order.setStatus(OrderStatus.PLACED);

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + itemReq.getProductId()));

            if (product.getStatus() != ProductStatus.APPROVED) {
                throw new InvalidOperationException("Product '" + product.getName() + "' is not available for purchase");
            }

            if (product.getQuantity() < itemReq.getQuantity()) {
                throw new InvalidOperationException("Insufficient stock for product '" + product.getName() + "'. Available: " + product.getQuantity());
            }

            // Decrement product inventory
            product.setQuantity(product.getQuantity() - itemReq.getQuantity());
            if (product.getQuantity() == 0) {
                product.setStatus(ProductStatus.SOLD);
            }
            productRepository.save(product);

            OrderItem orderItem = new OrderItem(product, itemReq.getQuantity(), product.getPrice());
            order.addItem(orderItem);
            totalAmount = totalAmount.add(orderItem.getSubtotal());
        }

        order.setTotalAmount(totalAmount);
        order = orderRepository.save(order);

        // Award reward points for eco-friendly purchasing (10 points per purchase)
        rewardService.addPoints(user, 15, "PURCHASE_ECO_PRODUCT", "Purchased eco-friendly product(s) - Order #" + order.getId());

        return mapToResponse(order);
    }

    public List<OrderResponse> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getSellerSalesOrders(Long sellerId) {
        return orderRepository.findSellerSalesOrders(sellerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id " + orderId));
        return mapToResponse(order);
    }

    public List<OrderResponse> getAllOrdersForAdmin() {
        return orderRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id " + orderId));
        order.setStatus(status);
        order = orderRepository.save(order);
        return mapToResponse(order);
    }

    private OrderResponse mapToResponse(Order order) {
        OrderResponse res = new OrderResponse();
        res.setId(order.getId());
        if (order.getUser() != null) {
            res.setUserId(order.getUser().getId());
            res.setUserName(order.getUser().getFullName());
        }
        res.setTotalAmount(order.getTotalAmount());
        res.setStatus(order.getStatus());
        res.setShippingAddress(order.getShippingAddress());
        res.setContactPhone(order.getContactPhone());
        res.setPaymentMethod(order.getPaymentMethod());
        res.setCreatedAt(order.getCreatedAt());

        List<OrderItemResponse> itemResponses = order.getItems().stream().map(item -> {
            OrderItemResponse ir = new OrderItemResponse();
            ir.setId(item.getId());
            if (item.getProduct() != null) {
                ir.setProductId(item.getProduct().getId());
                ir.setProductName(item.getProduct().getName());
                ir.setProductImageUrl(item.getProduct().getImageUrl());
            }
            ir.setQuantity(item.getQuantity());
            ir.setPricePerUnit(item.getPricePerUnit());
            ir.setSubtotal(item.getSubtotal());
            return ir;
        }).collect(Collectors.toList());

        res.setItems(itemResponses);
        return res;
    }
}
